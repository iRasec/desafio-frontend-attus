import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, UsuarioFormValue } from '../../../core/models/usuario.model';
import { UsuarioFormDialogComponent } from '../usuario-form-dialog/usuario-form-dialog.component';

/**
 * Tela de listagem de usuários (desafio 4).
 *
 * Estado gerenciado com Signals (sem NgRx aqui — o app cumpre "NgRx ou
 * Signals" usando Signals para esta feature; a estrutura NgRx completa fica
 * demonstrada em `state/todo` para a questão 3.2).
 *
 * RxJS usado além de map/tap: debounceTime, distinctUntilChanged, switchMap
 * e catchError no fluxo de busca.
 */
@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss',
})
export class UsuarioListComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly busca = new FormControl('', { nonNullable: true });

  readonly usuarios = signal<Usuario[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  constructor() {
    this.carregar();

    this.busca.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termo) => {
          this.carregando.set(true);
          this.erro.set(null);
          return this.usuarioService.listar(termo).pipe(
            catchError(() => {
              this.erro.set('Não foi possível carregar os usuários. Tente novamente.');
              return of<Usuario[]>([]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((usuarios) => {
        this.usuarios.set(usuarios);
        this.carregando.set(false);
      });
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.usuarioService
      .listar(this.busca.value)
      .pipe(
        catchError(() => {
          this.erro.set('Não foi possível carregar os usuários. Tente novamente.');
          return of<Usuario[]>([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((usuarios) => {
        this.usuarios.set(usuarios);
        this.carregando.set(false);
      });
  }

  abrirNovoUsuario(): void {
    const ref = this.dialog.open(UsuarioFormDialogComponent, {
      width: '480px',
      data: null,
    });

    ref.afterClosed().subscribe((resultado: UsuarioFormValue | undefined) => {
      if (!resultado) {
        return;
      }
      this.usuarioService.criar(resultado).subscribe(() => this.carregar());
    });
  }

  editarUsuario(usuario: Usuario): void {
    const ref = this.dialog.open(UsuarioFormDialogComponent, {
      width: '480px',
      data: usuario,
    });

    ref.afterClosed().subscribe((resultado: UsuarioFormValue | undefined) => {
      if (!resultado) {
        return;
      }
      this.usuarioService.atualizar(usuario.id, resultado).subscribe(() => this.carregar());
    });
  }
}
