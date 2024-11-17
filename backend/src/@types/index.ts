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
  isBanned: boolean;
  softDeleted: boolean;
};

export type Auth = { id: string };

export interface ApiResponse<T> {
  status: number; // Código de status HTTP (200, 400, 500, etc.)
  message: string; // Mensagem amigável (mensagem de sucesso ou erro)
  data: T; // Dados retornados pela API (pode ser qualquer tipo genérico)
  meta?: {
    total?: number; // Número total de itens (usado para paginação)
    page?: number; // Página atual (usado para paginação)
    per_page?: number; // Itens por página (usado para paginação)
  };
  href?: string;
}
