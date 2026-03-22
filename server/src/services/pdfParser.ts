import fs from "fs";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const { PDFParse } = require("pdf-parse");

  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  return result?.text ?? "";
}