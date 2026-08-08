import type { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown,
  statusCode = 200,
) {
  res.status(statusCode).json({ success: true, data });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
) {
  res.status(statusCode).json({ success: false, message });
}
