import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
}

export async function generateQuestions(
  text: string,
  numQuestions: number,
  difficulty: string
): Promise<GeneratedQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Return ONLY valid JSON. No markdown. No backticks.

Format:
[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctIndex": 0,
    "difficulty": "${difficulty}"
  }
]

Rules:
- Make exactly ${numQuestions} questions
- Exactly 4 options each
- correctIndex must be 0, 1, 2, or 3
- Use only the provided text
- No duplicate questions
- Wrong answers should be plausible

Text:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("Empty Gemini response");
  }

  const cleaned = content.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response is not an array");
  }

  return parsed as GeneratedQuestion[];
}