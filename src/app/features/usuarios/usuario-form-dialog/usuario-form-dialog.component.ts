import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { TipoTelefone, Usuario, UsuarioFormValue } from '../../../core/models/usuario.model';

/**
 * Modal de criação/edição de usuário (desafio 4.1).
 * Formulário reativo com validação por campo e botão "Salvar" desabilitado
 * enquanto o formulário for inválido. Quando aberto em modo edição
 * (dados recebidos via MAT_DIALOG_DATA), o formulário é preenchido
 * automaticamente com os valores do usuário.
 */
@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './usuario-form-dialog.component.html',
  styleUrl: './usuario-form-dialog.component.scss',
})
export class UsuarioFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UsuarioFormDialogComponent>);
  readonly usuario = inject<Usuario | null>(MAT_DIALOG_DATA);

  readonly tiposTelefone: TipoTelefone[] = ['CELULAR', 'RESIDENCIAL', 'COMERCIAL'];

  readonly form = this.fb.nonNullable.group({
    email: [this.usuario?.email ?? '', [Validators.required, Validators.email]],
    nome: [this.usuario?.nome ?? '', [Validators.required, Validators.minLength(3)]],
    cpf: [
      this.usuario?.cpf ?? '',
      [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)],
    ],
    telefone: [
      this.usuario?.telefone ?? '',
      [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)],
    ],
    tipoTelefone: [
      (this.usuario?.tipoTelefone ?? 'CELULAR') as TipoTelefone,
      Validators.required,
    ],
  });

  get modoEdicao(): boolean {
    return this.usuario !== null;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valor: UsuarioFormValue = this.form.getRawValue();
    this.dialogRef.close(valor);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
