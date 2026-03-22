<<<<<<< HEAD
import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/quizzes/generate
// TEMPORARY: creates a mock quiz from the resource's text
// To implement later I add: Zeins's AI service replaces the mock
router.post("/generate", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, numQuestions = 5 } = req.body;

    // verify the resource exists
=======
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

>>>>>>> person-c-backup
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

<<<<<<< HEAD
    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    // ──────────────────────────────────────────────────
    // MOCK QUIZ GENERATION
    // Replace this block with Zeins's service later:
    //   import { createQuizFromResource } from "../services/quizService";
    //   const quiz = await createQuizFromResource(resourceId, numQuestions, "mixed");
    // ──────────────────────────────────────────────────

    const mockQuestions = [
      {
        questionText: "Based on the uploaded material, which concept is most fundamental?",
        options: ["Recursion", "Iteration", "Abstraction", "Compilation"],
        correctIndex: 2,
        difficulty: "medium",
        orderIndex: 0,
      },
      {
        questionText: "What is the primary purpose of the topic discussed in the resource?",
        options: [
          "Data storage",
          "Problem solving",
          "Network communication",
          "User interface design",
        ],
        correctIndex: 1,
        difficulty: "easy",
        orderIndex: 1,
      },
      {
        questionText: "Which of the following best describes the relationship between the key concepts?",
        options: [
          "They are independent",
          "They form a hierarchy",
          "They are mutually exclusive",
          "They are synonymous",
        ],
        correctIndex: 1,
        difficulty: "medium",
        orderIndex: 2,
      },
      {
        questionText: "What would happen if the core principle were removed?",
        options: [
          "Nothing would change",
          "Performance would improve",
          "The system would fail",
          "Security would increase",
        ],
        correctIndex: 2,
        difficulty: "hard",
        orderIndex: 3,
      },
      {
        questionText: "Which real-world analogy best fits the main concept?",
        options: [
          "A library catalog",
          "A recipe book",
          "A traffic light",
          "A filing cabinet",
        ],
        correctIndex: 0,
        difficulty: "easy",
        orderIndex: 4,
      },
    ];

    // Only use as many questions as requested
    const questionsToCreate = mockQuestions.slice(0, numQuestions);

    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz: ${resource.title}`,
        resourceId: resource.id,
        questions: {
          create: questionsToCreate,
        },
      },
      include: {
        questions: { orderBy: { orderIndex: "asc" } },
      },
    });

    // ──────────────────────────────────────────────────

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Generate quiz error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// GET /api/quizzes/:id
// Returns a quiz with all its questions
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id as string },
      include: {
        questions: { orderBy: { orderIndex: "asc" } },
        resource: { select: { title: true } },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ error: "Failed to get quiz" });
  }
});

// GET /api/quizzes
// List all quizzes
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        resource: { select: { title: true } },
        _count: { select: { questions: true } },
      },
    });
    res.json(quizzes);
  } catch (error) {
    console.error("List quizzes error:", error);
    res.status(500).json({ error: "Failed to list quizzes" });
=======
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
>>>>>>> person-c-backup
  }
});

export default router;