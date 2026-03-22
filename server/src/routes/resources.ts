import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

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

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    try {
      console.log("upload hit");
      console.log("file:", req.file?.originalname, req.file?.mimetype, req.file?.size);
      console.log("title:", req.body.title);
      console.log("user:", req.user);

      const title = req.body.title;
      if (!title) {
        res.status(400).json({ error: "Title is required" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "PDF file is required" });
        return;
      }

      if (!req.user?.id) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const userId = req.user.id;
      const filePath = req.file.path;

      console.log("filePath:", filePath);

      const extractedText = await extractTextFromPDF(filePath);
      console.log("extracted text length:", extractedText?.length);

      const resource = await prisma.resource.create({
        data: {
          title,
          fileName: req.file.filename,
          fileUrl: filePath,
          extractedText,
          uploaderId: userId,
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
      console.error("Upload route error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }
);

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