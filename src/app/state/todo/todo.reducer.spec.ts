import { TodoActions } from './todo.actions';
import { todoReducer } from './todo.reducer';
import { Todo, todoInitialState } from './todo.model';

describe('todoReducer', () => {
  it('deve retornar o estado inicial para uma ação desconhecida', () => {
    const state = todoReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(todoInitialState);
  });

  it('loadTodos deve ligar carregando e limpar erro', () => {
    const state = todoReducer(
      { ...todoInitialState, erro: 'erro antigo' },
      TodoActions.loadTodos()
    );
    expect(state.carregando).toBe(true);
    expect(state.erro).toBeNull();
  });

  it('loadTodosSuccess deve preencher a lista e desligar carregando', () => {
    const todos: Todo[] = [{ id: 1, titulo: 'Comprar leite', concluida: false }];
    const state = todoReducer(
      { ...todoInitialState, carregando: true },
      TodoActions.loadTodosSuccess({ todos })
    );
    expect(state.todos).toEqual(todos);
    expect(state.carregando).toBe(false);
  });

  it('loadTodosError deve registrar a mensagem de erro', () => {
    const state = todoReducer(
      { ...todoInitialState, carregando: true },
      TodoActions.loadTodosError({ erro: 'falhou' })
    );
    expect(state.erro).toBe('falhou');
    expect(state.carregando).toBe(false);
  });

  it('toggleTodoComplete deve alternar apenas a tarefa indicada', () => {
    const estadoComTarefas = {
      ...todoInitialState,
      todos: [
        { id: 1, titulo: 'A', concluida: false },
        { id: 2, titulo: 'B', concluida: false },
      ],
    };

    const state = todoReducer(estadoComTarefas, TodoActions.toggleTodoComplete({ id: 1 }));

    expect(state.todos.find((t) => t.id === 1)?.concluida).toBe(true);
    expect(state.todos.find((t) => t.id === 2)?.concluida).toBe(false);
  });
});
