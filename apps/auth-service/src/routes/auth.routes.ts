import { Router } from "express";
import { validateBody } from "shared";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
