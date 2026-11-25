import { z } from "zod";
import { ValidationError } from "./error.util";

/**
 * HTTP boundary validator. DTO casts alone are not validation: every protected write
 * parses its body through a strict schema before it reaches a service.
 */
export function parseBody<S extends z.ZodType>(schema: S, body: unknown): z.infer<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      "Request validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
    );
  }
  return result.data;
}
