import type { Request, RequestHandler, Response } from "express";
import { randomUUID } from "node:crypto";
import type { RequestContextDTO } from "../dtos/request.dto";

const header = (req: Parameters<RequestHandler>[0], name: string): string | undefined => {
  const value = req.header(name);
  return value || undefined;
};

/** Enriches the request with IDs/locale and stores it for services (troott RequestContext style). */
export const requestContext: RequestHandler = (req, res, next) => {
  const context: RequestContextDTO = {
    requestId: header(req, "X-Request-ID") ?? randomUUID(),
    correlationId: header(req, "X-Correlation-ID") ?? randomUUID(),
    channel: header(req, "X-Channel"),
    language: header(req, "Accept-Language"),
    ip: req.ip,
    userAgent: header(req, "User-Agent"),
    isAuthenticated: false,
  };

  res.locals.context = context;
  res.setHeader("X-Request-ID", context.requestId);
  next();
};

/** Express 5 route params can be arrays; handlers always want the last value as a string. */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (Array.isArray(value)) return value[value.length - 1] ?? "";
  return value ?? "";
}

/** Typed accessor returning a default context when the middleware did not run. */
export function getContext(res: Response): RequestContextDTO {
  return (
    (res.locals.context as RequestContextDTO | undefined) ?? {
      requestId: "",
      correlationId: "",
      isAuthenticated: false,
    }
  );
}
