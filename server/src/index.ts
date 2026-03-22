import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";
import leaderboardRoutes from "./routes/leaderboard";

// Load .env variables BEFORE importing anything that uses them
dotenv.config();

// Import routes
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import quizRoutes from "./routes/quizzes";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

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