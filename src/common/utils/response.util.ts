import type { Response } from "express";
import type { ResponseDTO, SendResponseOptions } from "../dtos/response.dto";

/**
 * Writes the success half of the API envelope. Failures are always written by the
 * central error middleware, so handlers only call this on the happy path.
 */
export function sendResponse<T>(res: Response, options: SendResponseOptions<T>): void {
  const status = options.status ?? 200;
  const body: ResponseDTO<T> = {
    error: false,
    errors: [],
    data: options.data,
    message: options.message ?? "OK",
    status,
  };

  if (options.count !== undefined) body.count = options.count;
  if (options.total !== undefined) body.total = options.total;
  if (options.pagination !== undefined) body.pagination = options.pagination;

  res.status(status).json(body);
}
