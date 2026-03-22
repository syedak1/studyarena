import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name, school, schoolType } = req.body;

    // Validate input
    if (!email || !password || !name || !school) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Hash the password
    // The "10" is the salt rounds — higher = more secure but slower
    // 10 is the standard for most apps
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        school,
        schoolType: schoolType || "COLLEGE",
      },
    });

    // Create a JWT token
    // This token contains the user's id and name, signed with our secret
    // It expires in 24 hours — after that, they need to log in again
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Return the token and user info (but NOT the password hash)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        school: user.school,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't say "user not found" — that tells attackers which emails exist
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare the provided password with the stored hash
    // bcrypt.compare() hashes the input and checks if it matches
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Create a JWT token (same as signup)
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        school: user.school,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;