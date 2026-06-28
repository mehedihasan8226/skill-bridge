import { Router } from "express";
import { prisma } from "../../config/prisma";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.validation";

export const bookingRoutes = Router();

// Student creates booking
bookingRoutes.post(
  "/",
  requireAuth,
  requireRole("STUDENT"),
  validate(createBookingSchema),
  asyncHandler(async (req, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: req.body.tutorId },
    });
    if (!tutor) throw new AppError("Tutor not found", 404);

    const booking = await prisma.booking.create({
      data: {
        studentId: req.user!.id,
        tutorId: tutor.id,
        scheduledAt: new Date(req.body.scheduledAt),
        note: req.body.note,
      },
    });
    res.status(201).json({ success: true, data: booking });
  })
);

// My bookings (student or tutor)
bookingRoutes.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.user!.role === "STUDENT") {
      const bookings = await prisma.booking.findMany({
        where: { studentId: req.user!.id },
        include: {
          tutor: { include: { user: { select: { name: true } } } },
          review: true,
        },
        orderBy: { scheduledAt: "desc" },
      });
      return res.json({ success: true, data: bookings });
    }
    if (req.user!.role === "TUTOR") {
      const tp = await prisma.tutorProfile.findUnique({
        where: { userId: req.user!.id },
      });
      if (!tp) return res.json({ success: true, data: [] });
      const bookings = await prisma.booking.findMany({
        where: { tutorId: tp.id },
        include: { student: { select: { id: true, name: true, email: true } } },
        orderBy: { scheduledAt: "desc" },
      });
      return res.json({ success: true, data: bookings });
    }
    res.json({ success: true, data: [] });
  })
);

// Update status (tutor accept/reject/complete OR student cancel)
bookingRoutes.patch(
  "/:id/status",
  requireAuth,
  validate(updateBookingStatusSchema),
  asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { tutor: true },
    });
    if (!booking) throw new AppError("Booking not found", 404);

    const { status } = req.body as { status: string };
    const role = req.user!.role;
    const uid = req.user!.id;

    const tutorOwns = booking.tutor.userId === uid;
    const studentOwns = booking.studentId === uid;

    const tutorAllowed = ["ACCEPTED", "REJECTED", "COMPLETED"];
    const studentAllowed = ["CANCELLED"];

    const allowed =
      (role === "TUTOR" && tutorOwns && tutorAllowed.includes(status)) ||
      (role === "STUDENT" && studentOwns && studentAllowed.includes(status)) ||
      role === "ADMIN";

    if (!allowed) throw new AppError("Forbidden", 403);

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: status as any },
    });
    res.json({ success: true, data: updated });
  })
);
