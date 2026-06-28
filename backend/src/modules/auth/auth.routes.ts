import { Router } from "express";
import * as ctrl from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginSchema, registerSchema } from "./auth.validation";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), asyncHandler(ctrl.register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(ctrl.login));
authRoutes.get("/me", requireAuth, asyncHandler(ctrl.me));
