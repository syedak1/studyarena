import express, { Request, Response } from "express";
import { createQuizFromResource } from "../services/quizService";

const router = express.Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { resourceId, numQuestions, difficulty } = req.body;

    if (!resourceId || !numQuestions || !difficulty) {
      return res.status(400).json({
        error: "resourceId, numQuestions, difficulty required",
      });
    }

    const result = await createQuizFromResource(
      resourceId,
      Number(numQuestions),
      difficulty
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Generation failed",
    });
  }
});

export default router;