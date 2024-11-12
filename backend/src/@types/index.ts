export type PaginationProps = {
  skip: number;
  take: number;
};

export type PaginationResult = {
  total: number;
} & PaginationProps;

export type PayloadType = {
  sub: string;
  roles: string[];
};
