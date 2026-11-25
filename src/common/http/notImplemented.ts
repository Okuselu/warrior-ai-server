import type { RequestHandler } from "express";

/** Marks an MVP surface that is designed but not implemented yet. */
export function notImplemented(feature: string): RequestHandler {
  return (_req, res) => {
    res.status(501).json({ error: "NOT_IMPLEMENTED", feature });
  };
}
