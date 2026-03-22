import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

// ─── Person C's PDF parser service ───
// Try to load Person C's services/pdfParser.ts at runtime; if it's not a module yet,
// fall back to the local pdf-parse implementation so compilation/runtime succeed.
let extractTextFromPDF: (filePath: string) => Promise<string>;
try {
  const mod = require("../services/pdfParser");
  extractTextFromPDF = (mod && (mod.extractTextFromPDF ?? mod.default ?? mod)) as any;
} catch (err) {

  const pdfParse = require("pdf-parse");
  extractTextFromPDF = async function (filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  };
}

const router = Router();

// Ensure uploads directory exists (from Person C)
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// POST /api/resources/upload
// Auth required (Person B) + Person C's PDF extraction logic
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    try {
      const title = req.body.title;
      if (!title) {
        res.status(400).json({ error: "Title is required" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "PDF file is required" });
        return;
      }

      const userId = req.user!.id;
      const filePath = req.file.path;

      // Person C's extraction service
      const extractedText = await extractTextFromPDF(filePath);

      const resource = await prisma.resource.create({
        data: {
          title,
          fileName: req.file.filename,
          fileUrl: filePath,
          extractedText,
          uploaderId: userId, // from JWT, not hardcoded "testUser"
        },
      });

      res.status(201).json({
        id: resource.id,
        title: resource.title,
        fileName: resource.fileName,
        createdAt: resource.createdAt,
        textLength: extractedText.length,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }
);

// GET /api/resources
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        fileName: true,
        createdAt: true,
        uploader: { select: { name: true } },
        _count: { select: { quizzes: true } },
      },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Failed to list resources" });
  }
});

export default router;