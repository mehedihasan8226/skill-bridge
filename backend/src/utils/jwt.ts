import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.verify(token, secret) as JwtPayload;
}
