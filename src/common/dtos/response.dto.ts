export interface PaginationPageDTO {
  page: number;
  limit: number;
}

export interface IPaginationDTO {
  next?: PaginationPageDTO;
  prev?: PaginationPageDTO;
}

/** Canonical API envelope. Mirrors ResponseDTO in troott-api/identity/dtos/auth.dto.go. */
export interface ResponseDTO<T = unknown> {
  error: boolean;
  errors: unknown[];
  count?: number;
  total?: number;
  pagination?: IPaginationDTO;
  data: T;
  message: string;
  status: number;
}

export interface SendResponseOptions<T> {
  data: T;
  message?: string;
  status?: number;
  count?: number;
  total?: number;
  pagination?: IPaginationDTO;
}
