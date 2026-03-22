import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// extend the Express Request type to include our user data
// tells TypeScript "requests can have a .user property"
export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // 1. Get the token from the Authorization header
  // The header looks like: "Bearer eyJhbGciOi..."
  // We split on the space and take the second part (the token)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    //  verify the token using our key
    // jwt.verify() does two things:
    //   - checks if signature (token) created by our server?
    //   - checks expiration (has it expired?)
    //   - if either fails, it throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      name: string;
    };

    // attach the decoded user info to the request
    // route handlers can access req.user.id and req.user.name
    req.user = decoded;

    // continue request to next handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}