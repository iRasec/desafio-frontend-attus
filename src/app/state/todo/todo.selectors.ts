import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.model';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(selectTodoState, (state) => state.todos);

export const selectPendingTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((todo) => !todo.concluida)
);

export const selectTodoLoading = createSelector(selectTodoState, (state) => state.carregando);

export const selectTodoError = createSelector(selectTodoState, (state) => state.erro);
