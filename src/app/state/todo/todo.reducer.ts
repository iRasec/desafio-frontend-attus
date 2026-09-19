import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { todoInitialState } from './todo.model';

export const todoReducer = createReducer(
  todoInitialState,

  on(TodoActions.loadTodos, (state) => ({
    ...state,
    carregando: true,
    erro: null,
  })),

  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    carregando: false,
  })),

  on(TodoActions.loadTodosError, (state, { erro }) => ({
    ...state,
    carregando: false,
    erro,
  })),

  on(TodoActions.toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, concluida: !todo.concluida } : todo
    ),
  }))
);
