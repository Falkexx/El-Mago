import { Status } from 'src/@metadata';

export type PaginationProps = {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
};

type PaginationResult = PaginationProps & {
  total: number;
  totalPages: number;
  remainingPages: number;
};

export type PayloadType = {
  sub: string;
  roles: string[];
  isBanned: boolean;
  isDeleted: boolean;
};

export type SearchBuilderResult<D> = {
  data: D[];
  meta: PaginationResult;
};

export type Auth = { id: string; roles: string[] };

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  meta?: PaginationResult;
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

export type OrderStatusType = keyof typeof Status;

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys];

export type ExceptionType = {
  message: {
    ptBr: string;
    engUs: string;
    esp: string;
  };
  statusCode: number;
};

export type GoogleOauth2Response = {
  success: boolean;
  access_token: string;
  expires_in: number;
  refresh_token: string;
};
