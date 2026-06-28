import type { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { AppError } from "../utils/AppError";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AppError("Unauthorized", 401);
  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}

export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    if (!roles.includes(req.user.role))
      throw new AppError("Forbidden: insufficient role", 403);
    next();
  };
}
