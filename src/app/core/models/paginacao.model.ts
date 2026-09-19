export interface PaginaParams {
  pagina: number; // 1-based
  tamanho: number;
}

export interface Pagina<T> {
  itens: T[];
  total: number;
  pagina: number;
  tamanho: number;
  totalPaginas: number;
}
