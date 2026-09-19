import { filtrarEPaginar } from './filtrar-e-paginar';

interface UsuarioTeste {
  nome: string;
  ativo: boolean;
}

describe('filtrarEPaginar', () => {
  const usuarios: UsuarioTeste[] = [
    { nome: 'Ana', ativo: true },
    { nome: 'Bruno', ativo: false },
    { nome: 'Ana Paula', ativo: true },
    { nome: 'Carlos', ativo: true },
    { nome: 'Ana Beatriz', ativo: true },
  ];

  it('filtra por nome e retorna somente os itens da página pedida', () => {
    const resultado = filtrarEPaginar(
      usuarios,
      (u) => u.nome.toLowerCase().includes('ana'),
      { pagina: 1, tamanho: 2 }
    );

    expect(resultado.total).toBe(3);
    expect(resultado.itens).toEqual([
      { nome: 'Ana', ativo: true },
      { nome: 'Ana Paula', ativo: true },
    ]);
    expect(resultado.totalPaginas).toBe(2);
  });

  it('retorna a segunda página corretamente', () => {
    const resultado = filtrarEPaginar(
      usuarios,
      (u) => u.nome.toLowerCase().includes('ana'),
      { pagina: 2, tamanho: 2 }
    );

    expect(resultado.itens).toEqual([{ nome: 'Ana Beatriz', ativo: true }]);
  });

  it('retorna lista vazia quando nenhum item passa no filtro', () => {
    const resultado = filtrarEPaginar(usuarios, (u) => u.nome === 'Inexistente', {
      pagina: 1,
      tamanho: 10,
    });

    expect(resultado.itens).toEqual([]);
    expect(resultado.total).toBe(0);
    expect(resultado.totalPaginas).toBe(1);
  });

  it('lança erro para parâmetros de paginação inválidos', () => {
    expect(() => filtrarEPaginar(usuarios, () => true, { pagina: 0, tamanho: 2 })).toThrow();
  });
});
