import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioService);
  });

  it('deve listar o usuário inicial mockado', async () => {
    const usuarios = await firstValueFrom(service.listar());
    expect(usuarios.length).toBe(1);
    expect(usuarios[0].nome).toBe('Giana Sandrini');
  });

  it('deve filtrar por nome (case-insensitive)', async () => {
    const usuarios = await firstValueFrom(service.listar('giana'));
    expect(usuarios.length).toBe(1);

    const semResultado = await firstValueFrom(service.listar('inexistente'));
    expect(semResultado.length).toBe(0);
  });

  it('deve criar um novo usuário e refletir na listagem', async () => {
    await firstValueFrom(
      service.criar({
        nome: 'Novo Usuário',
        email: 'novo@teste.com',
        cpf: '111.111.111-11',
        telefone: '(45) 90000-0000',
        tipoTelefone: 'CELULAR',
      })
    );

    const usuarios = await firstValueFrom(service.listar());
    expect(usuarios.length).toBe(2);
    expect(usuarios.some((u) => u.nome === 'Novo Usuário')).toBe(true);
  });

  it('deve atualizar um usuário existente', async () => {
    const atualizado = await firstValueFrom(
      service.atualizar(1, {
        nome: 'Giana S. Atualizada',
        email: 'giana@attornatus.com.br',
        cpf: '000.000.000-00',
        telefone: '(45) 99999-0000',
        tipoTelefone: 'CELULAR',
      })
    );
    expect(atualizado.nome).toBe('Giana S. Atualizada');
  });

  it('deve lançar erro ao atualizar usuário inexistente', async () => {
    await expect(
      firstValueFrom(
        service.atualizar(999, {
          nome: 'X',
          email: 'x@x.com',
          cpf: '000',
          telefone: '000',
          tipoTelefone: 'CELULAR',
        })
      )
    ).rejects.toThrow();
  });
});
