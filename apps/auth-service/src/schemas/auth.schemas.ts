import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required"),
  password: z.string().min(6, "password must be at least six characters long"),
});

export const loginSchema = z.object({
  email: z.email("Valid email is required!"),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
