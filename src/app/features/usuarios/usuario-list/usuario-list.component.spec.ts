import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UsuarioListComponent } from './usuario-list.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

describe('UsuarioListComponent', () => {
  let fixture: ComponentFixture<UsuarioListComponent>;
  let component: UsuarioListComponent;
  let usuarioServiceSpy: { listar: jest.Mock; criar: jest.Mock; atualizar: jest.Mock };

  const usuarioMock: Usuario = {
    id: 1,
    nome: 'Giana Sandrini',
    email: 'giana@attornatus.com.br',
    cpf: '000.000.000-00',
    telefone: '(45) 99999-0000',
    tipoTelefone: 'CELULAR',
  };

  beforeEach(() => {
    usuarioServiceSpy = {
      listar: jest.fn().mockReturnValue(of([usuarioMock])),
      criar: jest.fn().mockReturnValue(of(usuarioMock)),
      atualizar: jest.fn().mockReturnValue(of(usuarioMock)),
    };

    TestBed.configureTestingModule({
      imports: [UsuarioListComponent, NoopAnimationsModule],
      providers: [{ provide: UsuarioService, useValue: usuarioServiceSpy }],
    });

    fixture = TestBed.createComponent(UsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve carregar a lista de usuários ao iniciar', () => {
    expect(usuarioServiceSpy.listar).toHaveBeenCalled();
    expect(component.usuarios()).toEqual([usuarioMock]);
    expect(component.carregando()).toBe(false);
  });

  it('deve aplicar debounce de 300ms na busca antes de chamar o serviço novamente', fakeAsync(() => {
    usuarioServiceSpy.listar.mockClear();

    component.busca.setValue('gi');
    tick(100);
    component.busca.setValue('gia');
    tick(299);
    expect(usuarioServiceSpy.listar).not.toHaveBeenCalled();

    tick(1);
    expect(usuarioServiceSpy.listar).toHaveBeenCalledTimes(1);
    expect(usuarioServiceSpy.listar).toHaveBeenCalledWith('gia');
  }));

  it('deve expor mensagem de erro quando o serviço falhar', fakeAsync(() => {
    usuarioServiceSpy.listar.mockReturnValue(throwError(() => new Error('falha')));

    component.busca.setValue('erro');
    tick(300);

    expect(component.erro()).toBeTruthy();
    expect(component.usuarios()).toEqual([]);
  }));

  it('deve recarregar a listagem após criar um usuário no dialog', () => {
    usuarioServiceSpy.listar.mockClear();
    const dialog = TestBed.inject(MatDialog);
    jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () =>
        of({
          nome: 'Novo',
          email: 'novo@teste.com',
          cpf: '111',
          telefone: '111',
          tipoTelefone: 'CELULAR',
        }),
    } as any);

    component.abrirNovoUsuario();

    expect(usuarioServiceSpy.criar).toHaveBeenCalled();
    expect(usuarioServiceSpy.listar).toHaveBeenCalled();
  });
});
