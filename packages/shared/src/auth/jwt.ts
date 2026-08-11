import jwt from "jsonwebtoken";
import type { JwtPayload } from "./types";

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

export function verifyToken(token: string): JwtPayload {
  const decodedToken = jwt.verify(token, extractJwtSecret());

  if (
    typeof decodedToken !== "object" ||
    decodedToken === null ||
    typeof decodedToken.userId !== "string" ||
    (decodedToken.role !== "USER" && decodedToken.role !== "ADMIN")
  )
    throw new Error("Invalid token error");
  return {
    userId: decodedToken.userId,
    role: decodedToken.role,
  };
}
