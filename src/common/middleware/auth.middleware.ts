import type { RequestHandler } from "express";
import type { Role } from "../constants";
import { UnauthorizedError, ForbiddenError } from "../utils/error.util";
import { verifyAppToken } from "../utils/token.util";
import { getContext } from "./request.middleware";

/** Verifies the bearer token and propagates the trusted identity into RequestContextDTO. */
export const authenticate: RequestHandler = async (req, res, next) => {
  const header = req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return next(new UnauthorizedError());

  try {
    const claims = await verifyAppToken(token);
    const context = getContext(res);
    res.locals.context = {
      ...context,
      isAuthenticated: true,
      userId: claims.sub,
      roles: [claims.role],
    };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

/** Role guard for clinician/admin surfaces. Use after authenticate. */
export function requireRoles(...allowed: Role[]): RequestHandler {
  return (_req, res, next) => {
    const context = getContext(res);
    const roles = context.roles ?? [];
    if (!context.isAuthenticated || !roles.some((role) => allowed.includes(role))) {
      return next(new ForbiddenError());
    }
    next();
  };
}
