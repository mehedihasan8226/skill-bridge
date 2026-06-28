import { Router } from "express";
import { prisma } from "../../config/prisma";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { updateProfileSchema } from "./user.validation";

export const userRoutes = Router();

userRoutes.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
    });
    const { password, ...safe } = user;
    res.json({ success: true, data: safe });
  })
);
