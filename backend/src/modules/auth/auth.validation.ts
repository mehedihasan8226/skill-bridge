import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(72),
  role: z.enum(["STUDENT", "TUTOR"]).default("STUDENT"),
  // Optional tutor profile fields
  subject: z.string().min(2).max(60).optional(),
  bio: z.string().min(10).max(500).optional(),
  hourlyRate: z.number().int().min(0).max(100000).optional(),
  experience: z.number().int().min(0).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
