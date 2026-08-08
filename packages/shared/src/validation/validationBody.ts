import { ZodSchema } from "zod/v3";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return next(new AppError(message, 400));
    }
    req.body = result.data;
    next();
  };
}
