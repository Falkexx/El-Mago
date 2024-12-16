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

export type FileType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export type StorageResult = {
  /**
   * URL of the uploaded object.
   */
  Location: string;
  /**
   * ETag of the uploaded object.
   */
  ETag: string;
  /**
   * Bucket to which the object was uploaded.
   */
  Bucket: string;
  /**
   * Key to which the object was uploaded.
   */
  Key: string;
};

export type SelectFieldsWithRelations<
  Entity,
  Fields extends keyof Entity,
  Relations extends keyof Entity,
> = {
  [F in Fields]: Entity[F];
} & {
  [R in Relations]: Entity[R];
};
