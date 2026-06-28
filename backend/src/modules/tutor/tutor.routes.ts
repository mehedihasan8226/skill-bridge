import { Router } from "express";
import { prisma } from "../../config/prisma";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { tutorListQuerySchema, upsertTutorSchema } from "./tutor.validation";

export const tutorRoutes = Router();

// List tutors (public)
tutorRoutes.get(
  "/",
  validate(tutorListQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const { subject, q, page, limit } = req.query as any;
    const where: any = {
      user: { isBlocked: false },
      ...(subject ? { subject: { contains: subject, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { subject: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
              { user: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tutorProfile.count({ where }),
    ]);
    res.json({ success: true, data: { items, total, page, limit } });
  })
);

// Single tutor (public)
tutorRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviews: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!tutor) throw new AppError("Tutor not found", 404);
    res.json({ success: true, data: tutor });
  })
);

// Tutor: create/update own profile
tutorRoutes.put(
  "/me",
  requireAuth,
  requireRole("TUTOR"),
  validate(upsertTutorSchema),
  asyncHandler(async (req, res) => {
    const profile = await prisma.tutorProfile.upsert({
      where: { userId: req.user!.id },
      update: req.body,
      create: { ...req.body, userId: req.user!.id },
    });
    res.json({ success: true, data: profile });
  })
);

// Tutor: my profile
tutorRoutes.get(
  "/me/profile",
  requireAuth,
  requireRole("TUTOR"),
  asyncHandler(async (req, res) => {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.id },
    });
    res.json({ success: true, data: profile });
  })
);
