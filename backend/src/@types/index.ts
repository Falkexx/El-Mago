export class PaginationProps {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export type PaginationResult<D> = {
  total: number;
  data: D;
} & PaginationProps;

export type PayloadType = {
  sub: string;
  roles: string[];
  isBanned: boolean;
  isDeleted: boolean;
};

export type Auth = { id: string; roles: string[] };

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    order: 'ASC' | 'DESC';
  };
  href?: string;
}
