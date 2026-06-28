import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body"): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.parse(req[source]);
    (req as any)[source] = parsed;
    next();
  };
