import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UsuarioFormDialogComponent } from './usuario-form-dialog.component';
import { Usuario } from '../../../core/models/usuario.model';

describe('UsuarioFormDialogComponent', () => {
  let fixture: ComponentFixture<UsuarioFormDialogComponent>;
  let component: UsuarioFormDialogComponent;
  let dialogRefSpy: { close: jest.Mock };

  function configurar(usuario: Usuario | null): void {
    dialogRefSpy = { close: jest.fn() };

    TestBed.configureTestingModule({
      imports: [UsuarioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: usuario },
      ],
    });

    fixture = TestBed.createComponent(UsuarioFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('deve iniciar inválido e vazio no modo criação', () => {
    configurar(null);
    expect(component.modoEdicao).toBe(false);
    expect(component.form.invalid).toBe(true);
  });

  it('não deve fechar o dialog ao salvar formulário inválido', () => {
    configurar(null);
    component.salvar();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.controls.email.touched).toBe(true);
  });

  it('deve fechar o dialog com os dados quando o formulário é válido', () => {
    configurar(null);
    component.form.setValue({
      email: 'teste@teste.com',
      nome: 'Fulano de Tal',
      cpf: '123.456.789-00',
      telefone: '(45) 99999-9999',
      tipoTelefone: 'CELULAR',
    });

    component.salvar();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      email: 'teste@teste.com',
      nome: 'Fulano de Tal',
      cpf: '123.456.789-00',
      telefone: '(45) 99999-9999',
      tipoTelefone: 'CELULAR',
    });
  });

  it('deve preencher o formulário automaticamente no modo edição', () => {
    const usuario: Usuario = {
      id: 1,
      email: 'giana@attornatus.com.br',
      nome: 'Giana Sandrini',
      cpf: '000.000.000-00',
      telefone: '(45) 99999-0000',
      tipoTelefone: 'CELULAR',
    };

    configurar(usuario);

    expect(component.modoEdicao).toBe(true);
    expect(component.form.value.nome).toBe('Giana Sandrini');
    expect(component.form.valid).toBe(true);
  });

  it('deve fechar o dialog sem retorno ao cancelar', () => {
    configurar(null);
    component.cancelar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});
