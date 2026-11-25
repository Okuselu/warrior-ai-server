import type { Request } from "express";
import type { IPaginationDTO } from "../dtos/response.dto";
import type { PaginationRequestDTO } from "../dtos/request.dto";

export interface PageResult<T> {
  items: T[];
  count: number;
  total: number;
  pagination: IPaginationDTO;
}

/** Last duplicate query value wins (HPP convention from troott-api). */
export function toPaginationDTO(query: Request["query"]): PaginationRequestDTO {
  const pick = (key: string): string | undefined => {
    const raw = query[key];
    const value = Array.isArray(raw) ? raw[raw.length - 1] : raw;
    return typeof value === "string" ? value : undefined;
  };

  return {
    page: pick("page"),
    limit: pick("limit"),
    select: pick("select"),
    order: pick("order") as PaginationRequestDTO["order"],
    from: pick("from"),
    to: pick("to"),
  };
}

/** Page starts at 1; default limit is 10. */
export function parsePagination(
  query: PaginationRequestDTO
): PaginationRequestDTO & { page: number; limit: number } {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  return { ...query, page, limit };
}

export function paginate<T>(data: T[], query: PaginationRequestDTO): PageResult<T> {
  const { page, limit } = parsePagination(query);
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);

  return {
    items,
    count: items.length,
    total: data.length,
    pagination: {
      prev: page > 1 ? { page: page - 1, limit } : undefined,
      next: start + limit < data.length ? { page: page + 1, limit } : undefined,
    },
  };
}
