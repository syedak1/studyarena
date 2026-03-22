import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma";
import { extractTextFromPDF } from "../services/pdfParser";
const router = express.Router();

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
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  }
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const title = req.body.title;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const filePath = req.file.path;
    const extractedText = await extractTextFromPDF(filePath);

    const resource = await prisma.resource.create({
      data: {
        title,
        fileName: req.file.filename,
        fileUrl: filePath,
        extractedText,
        uploaderId: "testUser"
      }
    });

    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Upload failed"
    });
  }
});

export default router;