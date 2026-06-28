import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  note: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]),
});
