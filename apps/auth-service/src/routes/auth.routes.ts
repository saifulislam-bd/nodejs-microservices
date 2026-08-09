import { Router } from "express";
import { validateBody } from "shared";
import { registerSchema } from "../schemas/auth.schemas";
import { register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateBody(registerSchema), register);

export default router;
