import type { Request, Response } from "express";
import * as svc from "./auth.service";
import { prisma } from "../../config/prisma";

export async function register(req: Request, res: Response) {
  const data = await svc.register(req.body);
  res.status(201).json({ success: true, message: "Registered", data });
}

export async function login(req: Request, res: Response) {
  const data = await svc.login(req.body);
  res.json({ success: true, message: "Logged in", data });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { tutorProfile: true },
  });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  const { password, ...safe } = user;
  res.json({ success: true, data: safe });
}
