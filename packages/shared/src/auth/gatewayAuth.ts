import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function requireGatewaySecret(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const expected = process.env.GATEWAY_SECRET;
  if (!expected) next(new AppError("Gateway secret is not configured", 500));

  const incoming = req.header("x-gateway-secret");
  if (!incoming || incoming !== expected) next(new AppError("Forbidden", 403));
  next();
}
