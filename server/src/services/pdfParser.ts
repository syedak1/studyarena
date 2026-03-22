import fs from "fs";

// pdf-parse exports a default function, not a named class
const pdfParse = require("pdf-parse");

export async function extractTextFromPDF(filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const text = data.text?.replace(/\s+/g, " ").trim();

  if (!text) {
    throw new Error("No text could be extracted from the PDF");
  }

  return text;
}