import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message, errors: err.errors });
  }
  console.error(err);
  return res
    .status(500)
    .json({ success: false, message: err.message || "Internal Server Error" });
};
