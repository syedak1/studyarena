import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { createQuizFromResource } from "../services/quizService";

const router = Router();

// POST /generate MUST come BEFORE GET /:id
router.post("/generate", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, numQuestions = 5, difficulty = "mixed" } = req.body;

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    // Call Person C's AI service directly — no silent fallback
    // If this fails, we WANT to see the error so we can fix it
    const quiz = await createQuizFromResource(resourceId, numQuestions, difficulty);

    res.status(201).json(quiz);
  } catch (error: any) {
    console.error("Generate quiz error:", error?.message || error);
    res.status(500).json({
      error: "Failed to generate quiz",
      detail: error?.message || "Unknown error",
    });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      include: { resource: { select: { title: true } }, _count: { select: { questions: true } } },
    });
    res.json(quizzes);
  } catch {
    res.status(500).json({ error: "Failed to list quizzes" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id as string },
      include: { questions: { orderBy: { orderIndex: "asc" } }, resource: { select: { title: true } } },
    });
    if (!quiz) { res.status(404).json({ error: "Quiz not found" }); return; }
    res.json(quiz);
  } catch {
    res.status(500).json({ error: "Failed to get quiz" });
  }
});

export default router;