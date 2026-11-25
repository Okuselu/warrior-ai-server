import type { Role } from "../constants";

// QUERY PARAMS: ?page=1&limit=10&select=fields-separated-by-comma&order=asc-or-desc&from=2026-05-10&to=2026-06-10
export interface PaginationRequestDTO {
  page?: number | string;
  limit?: number | string;
  select?: string;
  order?: "asc" | "desc";
  from?: string;
  to?: string;
}

/** Context populated by request middleware and passed as the first argument to services. */
export interface RequestContextDTO {
  requestId: string;
  correlationId: string;
  channel?: string;
  language?: string;
  ip?: string;
  userAgent?: string;
  isAuthenticated: boolean;
  userId?: string;
  roles?: Role[];
}
