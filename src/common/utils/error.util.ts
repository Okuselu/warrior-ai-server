/**
 * ErrorResponse carries structured HTTP error information from services up to the
 * central error middleware. Handlers never write their own failure body.
 */
export class ErrorResponse extends Error {
  readonly statusCode: number;
  readonly errors: unknown[];
  readonly data: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    errors: unknown[] = [],
    data: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = "ErrorResponse";
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
  }
}

export function newErrorResponse(
  message: string,
  statusCode: number,
  errors: unknown[] = [],
  data: Record<string, unknown> = {}
): ErrorResponse {
  return new ErrorResponse(message, statusCode, errors, data);
}

export class ValidationError extends ErrorResponse {
  constructor(message: string, errors: unknown[] = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(entity: string) {
    super(`${entity} not found`, 404);
  }
}

export class ConflictError extends ErrorResponse {
  constructor(message: string) {
    super(message, 409);
  }
}

/** Placeholder for MVP surfaces that are designed but not implemented yet. */
export class NotImplementedError extends ErrorResponse {
  constructor(feature: string) {
    super(`${feature} is not implemented yet`, 501, [], { feature });
  }
}
