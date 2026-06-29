import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email(),
    password: z.string().min(6, "Min 6 characters"),
    role: z.enum(["STUDENT", "TUTOR"]),
    subject: z.string().optional(),
    bio: z.string().optional(),
    hourlyRate: z.coerce.number().int().min(0).optional(),
    experience: z.coerce.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "TUTOR") {
      if (!data.subject || data.subject.length < 2)
        ctx.addIssue({ code: "custom", path: ["subject"], message: "Subject required" });
      if (!data.bio || data.bio.length < 10)
        ctx.addIssue({ code: "custom", path: ["bio"], message: "Bio min 10 chars" });
      if (data.hourlyRate === undefined)
        ctx.addIssue({ code: "custom", path: ["hourlyRate"], message: "Hourly rate required" });
    }
  });

export const bookingSchema = z.object({
  scheduledAt: z.string().min(1, "Choose date/time"),
  note: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3, "Min 3 chars").max(500),
});

export const tutorProfileSchema = z.object({
  subject: z.string().min(2),
  bio: z.string().min(10),
  hourlyRate: z.coerce.number().int().min(0),
  experience: z.coerce.number().int().min(0).optional(),
});
