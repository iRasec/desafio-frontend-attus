import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodoActions } from './todo.actions';
import { Todo } from './todo.model';

/**
 * Efeito que reage a loadTodos: dispara uma chamada HTTP (mockada, URL
 * fictícia — não há back-end real neste desafio) e despacha sucesso ou
 * erro conforme o resultado, usando switchMap para cancelar requisições
 * anteriores caso loadTodos seja disparada novamente antes da resposta.
 */
@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.http.get<Todo[]>('https://api.exemplo.fake/todos').pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError((erro: unknown) =>
            of(
              TodoActions.loadTodosError({
                erro: erro instanceof Error ? erro.message : 'Erro ao carregar tarefas.',
              })
            )
          )
        )
      )
    )
  );
}
