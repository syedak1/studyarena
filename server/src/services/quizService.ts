import prisma from "../lib/prisma";
import { generateQuestions, GeneratedQuestion } from "./aiGenerator";

export async function createQuizFromResource(
  resourceId: string,
  numQuestions: number,
  difficulty: string
) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (!resource.extractedText || !resource.extractedText.trim()) {
    throw new Error("Resource has no extracted text");
  }

  const generatedQuestions: GeneratedQuestion[] = await generateQuestions(
    resource.extractedText,
    numQuestions,
    difficulty
  );

  if (!generatedQuestions.length) {
    throw new Error("No questions were generated");
  }

  const quiz = await prisma.quiz.create({
    data: {
      resourceId: resource.id,
      title: `Quiz for ${resource.title}`,
    },
  });

  let index = 0;

  for (const q of generatedQuestions) {
    if (
      !q.questionText ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correctIndex !== "number" ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      throw new Error("Generated question format is invalid");
    }

    await prisma.question.create({
      data: {
        quizId: quiz.id,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        difficulty: q.difficulty || difficulty,
        orderIndex: index,
      },
    });

    index++;
  }

  const fullQuiz = await prisma.quiz.findUnique({
    where: { id: quiz.id },
    include: {
      questions: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  return fullQuiz;
}