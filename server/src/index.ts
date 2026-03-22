import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";

import resourcesRoutes from "./routes/resources";
import quizRoutes from "./routes/quizzes";

dotenv.config();

// Import routes
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import roomRoutes from "./routes/rooms";

// ─── Socket handler ───

import { registerSocketHandlers } from "./socket/handler";

console.log("Starting server...");

const app = express();

// Socket.IO needs the raw HTTP server, NOT app.listen()
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
app.use(express.json());

app.use("/api/resources", resourcesRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Uncomment after handler.ts is built ───
 registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export { io };