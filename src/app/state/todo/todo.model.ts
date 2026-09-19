export interface Todo {
  id: number;
  titulo: string;
  concluida: boolean;
}

export interface TodoState {
  todos: Todo[];
  carregando: boolean;
  erro: string | null;
}

export const todoInitialState: TodoState = {
  todos: [],
  carregando: false,
  erro: null,
};
