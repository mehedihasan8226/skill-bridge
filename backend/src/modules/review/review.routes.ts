import { Router } from "express";
import { prisma } from "../../config/prisma";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { createReviewSchema } from "./review.validation";

export const reviewRoutes = Router();

// Public: reviews for a tutor
reviewRoutes.get(
  "/tutor/:tutorId",
  asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
      where: { tutorId: req.params.tutorId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: reviews });
  })
);

// Student: create a review for a completed booking
reviewRoutes.post(
  "/",
  requireAuth,
  requireRole("STUDENT"),
  validate(createReviewSchema),
  asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({
      where: { id: req.body.bookingId },
    });
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.studentId !== req.user!.id)
      throw new AppError("Not your booking", 403);
    if (booking.status !== "COMPLETED")
      throw new AppError("Booking must be completed", 400);

    const existing = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    });
    if (existing) throw new AppError("Review already exists", 409);

    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        authorId: req.user!.id,
        tutorId: booking.tutorId,
        rating: req.body.rating,
        comment: req.body.comment,
      },
    });
    res.status(201).json({ success: true, data: review });
  })
);
