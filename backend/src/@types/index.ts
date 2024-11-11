export type PaginationProps = {
  skip: number;
  take: number;
};
export type PaginationResult = {
  total: number;
} & PaginationProps;
