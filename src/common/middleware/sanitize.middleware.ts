import type { RequestHandler } from "express";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    const clean: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = sanitizeValue(item);
    }
    return clean;
  }
  return value;
}

/** Strips unsafe keys and escapes angle brackets in request bodies (data contract §8). */
export const sanitize: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
};
