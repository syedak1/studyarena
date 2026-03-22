import express, { Request, Response } from "express";
import prisma from "../lib/prisma";
import { generateQuestions } from "../services/aiGenerator";

const router = express.Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { resourceId, numQuestions, difficulty } = req.body;

    if (!resourceId || !numQuestions || !difficulty) {
      return res.status(400).json({
        error: "resourceId, numQuestions, difficulty required",
      });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || !resource.extractedText) {
      return res.status(404).json({ error: "Resource not found or no text" });
    }

    const questions = await generateQuestions(
      resource.extractedText,
      Number(numQuestions),
      difficulty
    );

    const quiz = await prisma.quiz.create({
      data: {
        resourceId,
        title: `Quiz for ${resource.title}`,
      },
    });

    let index = 0;

    for (const q of questions) {
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          questionText: q.questionText,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: q.difficulty,
          orderIndex: index,
        },
      });

      index++;
    }

    return res.status(201).json({
      quizId: quiz.id,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Generation failed",
    });
  }
});

export default router;