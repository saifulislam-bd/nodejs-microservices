import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.types";

function extractJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is missing");
  return secret;
}

export function signToken(payload: JwtPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload, extractJwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}
