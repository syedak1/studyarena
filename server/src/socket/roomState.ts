// ============================================================
// In-memory state for all active game rooms
// Think of this as a whiteboard — fast to read/write, but
// it disappears when the server restarts. That's fine for a demo.
// ============================================================

// ─── Types ───

export interface Player {
  socketId: string;      // Socket.IO's unique connection ID
  oderId: string;      // our database user ID
  name: string;
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  isHost: boolean;
}

export interface GameQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  orderIndex: number;
}

export interface RoomState {
  roomId: string;
  joinCode: string;
  status: "WAITING" | "ACTIVE" | "FINISHED";
  players: Map<string, Player>;       // keyed by oderId
  questions: GameQuestion[];
  currentQuestionIndex: number;       // -1 means no question sent yet
  answers: Map<string, number>;       // oderId → answerIndex (current question only)
  timePerQuestion: number;            // seconds
  questionStartTime: number;          // Date.now() when question was sent
  timerHandle: NodeJS.Timeout | null; // so we can cancel the timer
}

// ─── The Store ───

const rooms = new Map<string, RoomState>();

// ─── Create / Get / Delete ───

export function createRoomState(
  roomId: string,
  joinCode: string,
  timePerQuestion: number
): RoomState {
  const state: RoomState = {
    roomId,
    joinCode,
    status: "WAITING",
    players: new Map(),
    questions: [],
    currentQuestionIndex: -1,
    answers: new Map(),
    timePerQuestion,
    questionStartTime: 0,
    timerHandle: null,
  };
  rooms.set(roomId, state);
  return state;
}

export function getRoomState(roomId: string): RoomState | undefined {
  return rooms.get(roomId);
}

export function deleteRoom(roomId: string): void {
  const room = rooms.get(roomId);
  if (room?.timerHandle) clearTimeout(room.timerHandle);
  rooms.delete(roomId);
}

// ─── Player Management ───

export function addPlayer(
  roomId: string,
  oderId: string,
  socketId: string,
  name: string,
  isHost: boolean
): Player | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player: Player = {
    socketId,
    oderId,
    name,
    score: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    isHost,
  };
  room.players.set(oderId, player);
  return player;
}

export function removePlayer(roomId: string, oderId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;
  room.players.delete(oderId);

  // If room is empty, clean up
  if (room.players.size === 0) {
    deleteRoom(roomId);
  }
}

export function findRoomBySocketId(
  socketId: string
): { roomId: string; oderId: string } | null {
  for (const [roomId, room] of rooms) {
    for (const [oderId, player] of room.players) {
      if (player.socketId === socketId) {
        return { roomId, oderId };
      }
    }
  }
  return null;
}

export function getPlayerList(
  roomId: string
): { id: string; name: string; isHost: boolean }[] {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.players.values()).map((p) => ({
    id: p.oderId,
    name: p.name,
    isHost: p.isHost,
  }));
}

// ─── Game Flow ───

export function loadQuestions(roomId: string, questions: GameQuestion[]): void {
  const room = rooms.get(roomId);
  if (!room) return;
  room.questions = questions;
  room.status = "ACTIVE";
  room.currentQuestionIndex = -1;
}

export function getNextQuestion(roomId: string): GameQuestion | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  room.currentQuestionIndex += 1;
  if (room.currentQuestionIndex >= room.questions.length) {
    room.status = "FINISHED";
    return null;
  }

  room.questionStartTime = Date.now();
  room.answers.clear();  // clear previous round's answers
  return room.questions[room.currentQuestionIndex];
}

// ─── Answer Handling ───

export function recordAnswer(
  roomId: string,
  oderId: string,
  answerIndex: number
): boolean {
  const room = rooms.get(roomId);
  if (!room || room.status !== "ACTIVE") return false;
  if (room.answers.has(oderId)) return false; // already answered
  room.answers.set(oderId, answerIndex);
  return true;
}

export function allPlayersAnswered(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  return room.answers.size >= room.players.size;
}

// ─── Scoring ───

export function scoreCurrentRound(roomId: string): {
  correctIndex: number;
  scores: {
    playerId: string;
    playerName: string;
    score: number;
    delta: number;
  }[];
} | null {
  const room = rooms.get(roomId);
  if (!room || room.currentQuestionIndex < 0) return null;

  const question = room.questions[room.currentQuestionIndex];
  const scores: {
    playerId: string;
    playerName: string;
    score: number;
    delta: number;
  }[] = [];

  for (const [oderId, player] of room.players) {
    const answer = room.answers.get(oderId);
    let delta = 0;

    if (answer !== undefined) {
      player.totalAnswered += 1;
      if (answer === question.correctIndex) {
        // Speed bonus: faster answers get more points
        // 1000 points max (instant answer) down to 500 (answered at last second)
        const elapsed = Date.now() - room.questionStartTime;
        const maxTime = room.timePerQuestion * 1000;
        const timeRatio = Math.max(0, 1 - elapsed / maxTime);
        delta = Math.round(500 + 500 * timeRatio);
        player.score += delta;
        player.correctAnswers += 1;
      }
    }

    scores.push({
      playerId: oderId,
      playerName: player.name,
      score: player.score,
      delta,
    });
  }

  scores.sort((a, b) => b.score - a.score);
  return { correctIndex: question.correctIndex, scores };
}

export function getFinalScores(roomId: string): {
  playerId: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  rank: number;
}[] {
  const room = rooms.get(roomId);
  if (!room) return [];

  return Array.from(room.players.values())
    .map((p) => ({
      playerId: p.oderId,
      playerName: p.name,
      score: p.score,
      correctAnswers: p.correctAnswers,
      totalAnswered: p.totalAnswered,
    }))
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}