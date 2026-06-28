import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { signToken } from "../../utils/jwt";
import type { LoginInput, RegisterInput } from "./auth.validation";

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email already in use", 409);

  const hashed = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      role: input.role,
      ...(input.role === "TUTOR" && input.subject && input.bio && input.hourlyRate !== undefined
        ? {
            tutorProfile: {
              create: {
                subject: input.subject,
                bio: input.bio,
                hourlyRate: input.hourlyRate,
                experience: input.experience ?? 0,
              },
            },
          }
        : {}),
    },
    include: { tutorProfile: true },
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: sanitize(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { tutorProfile: true },
  });
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.isBlocked) throw new AppError("Your account has been blocked", 403);

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: sanitize(user) };
}

function sanitize(u: any) {
  const { password, ...rest } = u;
  return rest;
}
