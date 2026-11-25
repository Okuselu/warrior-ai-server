import { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
}
