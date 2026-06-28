import { Router } from "express";
import { prisma } from "../../config/prisma";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";

export const adminRoutes = Router();
adminRoutes.use(requireAuth, requireRole("ADMIN"));

adminRoutes.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [users, tutors, bookings, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.tutorProfile.count(),
      prisma.booking.count(),
      prisma.review.count(),
    ]);
    res.json({ success: true, data: { users, tutors, bookings, reviews } });
  })
);

adminRoutes.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { tutorProfile: true },
    });
    res.json({
      success: true,
      data: users.map(({ password, ...u }) => u),
    });
  })
);

adminRoutes.patch(
  "/users/:id/block",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: true },
    });
    const { password, ...safe } = user;
    res.json({ success: true, data: safe });
  })
);

adminRoutes.patch(
  "/users/:id/unblock",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: false },
    });
    const { password, ...safe } = user;
    res.json({ success: true, data: safe });
  })
);

adminRoutes.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "User deleted" });
  })
);

adminRoutes.get(
  "/bookings",
  asyncHandler(async (_req, res) => {
    const bookings = await prisma.booking.findMany({
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: bookings });
  })
);
