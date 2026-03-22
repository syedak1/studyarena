import { Router, Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

function generateJoinCode(): string {
  return crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
}

// POST /api/rooms/create
router.post("/create", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, timePerQuestion = 30, maxPlayers = 10 } = req.body;
    const userId = req.user!.id;

    // Verify quiz exists
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    // Generate a unique join code
    let joinCode = generateJoinCode();
    let existing = await prisma.room.findUnique({ where: { joinCode } });
    while (existing) {
      joinCode = generateJoinCode();
      existing = await prisma.room.findUnique({ where: { joinCode } });
    }

    const room = await prisma.room.create({
      data: {
        joinCode,
        quizId,
        hostId: userId,
        maxPlayers,
        timePerQuestion,
        status: "WAITING",
      },
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// GET /api/rooms/:joinCode
router.get("/:joinCode", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const joinCodeParam = Array.isArray(req.params.joinCode)
      ? req.params.joinCode[0]
      : req.params.joinCode;

    const room = await prisma.room.findUnique({
      where: { joinCode: joinCodeParam.toUpperCase() },
      include: {
        quiz: {
          include: { _count: { select: { questions: true } } },
        },
        host: { select: { id: true, name: true } },
      },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json(room);
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({ error: "Failed to get room" });
  }
});

export default router;