import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../common/utils/error.util";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    error: true,
    errors: [],
    data: {},
    message: "Not found",
    status: 404,
  });
}

/** Central error writer: handlers/services never build their own failure body. */
export function errorHandler(
  err: ErrorResponse | (Error & { status?: number }),
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof ErrorResponse ? err.statusCode : err.status || 500;
  const message = err.message || "Server Error";
  const errors = err instanceof ErrorResponse ? err.errors : [];
  const data = err instanceof ErrorResponse ? err.data : {};

  if (status >= 500) console.error(err);

  res.status(status).json({
    error: true,
    errors,
    data,
    message,
    status,
  });
}
