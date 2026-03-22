import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import {
  createRoomState,
  getRoomState,
  addPlayer,
  removePlayer,
  findRoomBySocketId,
  loadQuestions,
  recordAnswer,
  allPlayersAnswered,
  scoreCurrentRound,
  getNextQuestion,
  getFinalScores,
  getPlayerList,
  deleteRoom,
  GameQuestion,
} from "./roomState";

export function registerSocketHandlers(io: SocketServer): void {
  // This fires every time ANY client connects via WebSocket
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ─── JOIN ROOM ───
    socket.on("join-room", async (data: { roomId: string; token: string }) => {
      try {
        // Step 1: verify the token to know WHO this is
        const decoded = jwt.verify(
          data.token,
          process.env.JWT_SECRET as string
        ) as { id: string; name: string };

        // Step 2: look up the room in the database
        const dbRoom = await prisma.room.findUnique({
          where: { id: data.roomId },
        });
        if (!dbRoom) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Step 3: create in-memory state if this is the first connection
        let roomState = getRoomState(data.roomId);
        if (!roomState) {
          roomState = createRoomState(
            data.roomId,
            dbRoom.joinCode,
            dbRoom.timePerQuestion
          );
        }

        // Step 4: check room isn't full or already started
        if (roomState.players.size >= dbRoom.maxPlayers) {
          socket.emit("error", { message: "Room is full" });
          return;
        }
        if (roomState.status !== "WAITING") {
          socket.emit("error", { message: "Game already in progress" });
          return;
        }

        // Step 5: add the player
        const isHost = decoded.id === dbRoom.hostId;
        addPlayer(data.roomId, decoded.id, socket.id, decoded.name, isHost);

        // Step 6: join the Socket.IO "room" (broadcast channel)
        socket.join(data.roomId);

        // Step 7: tell everyone the player list updated
        io.to(data.roomId).emit("room-update", {
          players: getPlayerList(data.roomId),
          status: roomState.status,
        });

        console.log(`[Socket] ${decoded.name} joined room ${dbRoom.joinCode}`);
      } catch (err) {
        console.error("[Socket] join-room error:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // ─── START GAME ───
    socket.on("start-game", async (data: { roomId: string }) => {
      try {
        const roomState = getRoomState(data.roomId);
        if (!roomState) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Verify the sender is the host
        const caller = findRoomBySocketId(socket.id);
        if (!caller) return;
        const player = roomState.players.get(caller.oderId);
        if (!player?.isHost) {
          socket.emit("error", { message: "Only the host can start the game" });
          return;
        }

        // Load questions from DB
        const dbRoom = await prisma.room.findUnique({
          where: { id: data.roomId },
          include: {
            quiz: {
              include: {
                questions: { orderBy: { orderIndex: "asc" } },
              },
            },
          },
        });

        if (!dbRoom?.quiz?.questions?.length) {
          socket.emit("error", { message: "Quiz has no questions" });
          return;
        }

        const questions: GameQuestion[] = dbRoom.quiz.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options as string[],
          correctIndex: q.correctIndex,
          orderIndex: q.orderIndex,
        }));

        loadQuestions(data.roomId, questions);

        await prisma.room.update({
          where: { id: data.roomId },
          data: { status: "ACTIVE" },
        });

        io.to(data.roomId).emit("room-update", {
          players: getPlayerList(data.roomId),
          status: "ACTIVE",
        });

        // Brief pause, then first question
        setTimeout(() => sendNextQuestion(io, data.roomId), 3000);

        console.log(`[Socket] Game started in room ${roomState.joinCode}`);
      } catch (err) {
        console.error("[Socket] start-game error:", err);
        socket.emit("error", { message: "Failed to start game" });
      }
    });

    // ─── SUBMIT ANSWER ───
    socket.on("submit-answer", (data: {
      roomId: string;
      questionId: string;
      answerIndex: number;
    }) => {
      const caller = findRoomBySocketId(socket.id);
      if (!caller) return;

      const recorded = recordAnswer(data.roomId, caller.oderId, data.answerIndex);
      if (!recorded) return;

      // If everyone answered, skip the timer
      if (allPlayersAnswered(data.roomId)) {
        const roomState = getRoomState(data.roomId);
        if (roomState?.timerHandle) {
          clearTimeout(roomState.timerHandle);
          roomState.timerHandle = null;
        }
        scoreAndAdvance(io, data.roomId);
      }
    });

    // ─── DISCONNECT ───
    socket.on("disconnect", () => {
      const found = findRoomBySocketId(socket.id);
      if (found) {
        removePlayer(found.roomId, found.oderId);
        const roomState = getRoomState(found.roomId);
        if (roomState) {
          io.to(found.roomId).emit("room-update", {
            players: getPlayerList(found.roomId),
            status: roomState.status,
          });
        }
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}

// ─── Game Flow Helpers ───

function sendNextQuestion(io: SocketServer, roomId: string): void {
  const roomState = getRoomState(roomId);
  if (!roomState) return;

  const question = getNextQuestion(roomId);
  if (!question) {
    endGame(io, roomId);
    return;
  }

  // Send question WITHOUT correctIndex (players must not see it)
  io.to(roomId).emit("question", {
    questionId: question.id,
    questionText: question.questionText,
    options: question.options,
    orderIndex: question.orderIndex,
    totalQuestions: roomState.questions.length,
    timeLimit: roomState.timePerQuestion,
  });

  // Start the timer
  roomState.timerHandle = setTimeout(() => {
    scoreAndAdvance(io, roomId);
  }, roomState.timePerQuestion * 1000);
}

function scoreAndAdvance(io: SocketServer, roomId: string): void {
  const result = scoreCurrentRound(roomId);
  if (!result) return;

  io.to(roomId).emit("round-result", {
    correctIndex: result.correctIndex,
    scores: result.scores,
  });

  const roomState = getRoomState(roomId);
  if (!roomState) return;

  const isLastQuestion =
    roomState.currentQuestionIndex >= roomState.questions.length - 1;

  if (isLastQuestion) {
    setTimeout(() => endGame(io, roomId), 3000);
  } else {
    setTimeout(() => sendNextQuestion(io, roomId), 3000);
  }
}

async function endGame(io: SocketServer, roomId: string): Promise<void> {
  const roomState = getRoomState(roomId);
  if (!roomState) return;

  const finalScores = getFinalScores(roomId);
  const winnerId = finalScores.length > 0 ? finalScores[0].playerId : "";

  io.to(roomId).emit("game-over", { finalScores, winnerId });

  // Save scores to database
  try {
    for (const score of finalScores) {
      await prisma.playerScore.upsert({
        where: {
          roomId_userId: { roomId, userId: score.playerId },
        },
        update: {
          score: score.score,
          correctAnswers: score.correctAnswers,
          totalAnswered: score.totalAnswered,
        },
        create: {
          roomId,
          userId: score.playerId,
          score: score.score,
          correctAnswers: score.correctAnswers,
          totalAnswered: score.totalAnswered,
        },
      });
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { status: "FINISHED" },
    });
  } catch (err) {
    console.error("[Socket] Error saving scores:", err);
  }

  // Clean up memory after 30 seconds
  setTimeout(() => deleteRoom(roomId), 30000);
}