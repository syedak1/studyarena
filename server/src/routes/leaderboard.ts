import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/leaderboard
// Returns all players ranked by total score across all games
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Aggregate scores per user across all rooms
    const aggregated = await prisma.playerScore.groupBy({
      by: ["userId"],
      _sum: {
        score: true,
        correctAnswers: true,
        totalAnswered: true,
      },
      _count: {
        roomId: true, // number of games played
      },
      orderBy: {
        _sum: { score: "desc" },
      },
    });

    // Fetch user names for each entry
    const userIds = aggregated.map((a) => a.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const leaderboard = aggregated.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      name: userMap.get(entry.userId) || "Unknown",
      totalScore: entry._sum.score || 0,
      totalCorrect: entry._sum.correctAnswers || 0,
      totalAnswered: entry._sum.totalAnswered || 0,
      gamesPlayed: entry._count.roomId || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

// GET /api/leaderboard/me
// Returns the current user's stats
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const scores = await prisma.playerScore.findMany({
      where: { userId },
      select: {
        score: true,
        correctAnswers: true,
        totalAnswered: true,
      },
    });

    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const totalCorrect = scores.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalAnswered = scores.reduce((sum, s) => sum + s.totalAnswered, 0);
    const gamesPlayed = scores.length;

    res.json({
      userId,
      totalScore,
      totalCorrect,
      totalAnswered,
      gamesPlayed,
    });
  } catch (error) {
    console.error("My stats error:", error);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;