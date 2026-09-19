import { Pagina, PaginaParams } from '../models/paginacao.model';

/**
 * Questão 1.2 — Generics e tipos utilitários.
 *
 * Filtra um array com um predicado e retorna apenas os itens da página
 * solicitada, junto com o total de registros que passaram no filtro
 * (útil para montar a paginação na tela, sem precisar filtrar o array
 * inteiro de novo no template).
 *
 * Totalmente tipado — sem `any` em nenhum ponto.
 */
export function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {
  const { pagina, tamanho } = params;

  if (pagina < 1 || tamanho < 1) {
    throw new Error('Parâmetros de paginação inválidos: "pagina" e "tamanho" devem ser >= 1.');
  }

  const filtrados = data.filter(filterFn);
  const total = filtrados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / tamanho));

  const inicio = (pagina - 1) * tamanho;
  const itens = filtrados.slice(inicio, inicio + tamanho);

  return { itens, total, pagina, tamanho, totalPaginas };
}
