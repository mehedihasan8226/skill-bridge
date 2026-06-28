import { z } from "zod";

export const upsertTutorSchema = z.object({
  subject: z.string().min(2).max(60),
  bio: z.string().min(10).max(500),
  hourlyRate: z.number().int().min(0).max(100000),
  experience: z.number().int().min(0).max(80).optional(),
  avatarUrl: z.string().url().optional(),
});

export const tutorListQuerySchema = z.object({
  subject: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
