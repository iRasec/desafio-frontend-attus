import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Error': props<{ erro: string }>(),
    'Toggle Todo Complete': props<{ id: number }>(),
  },
});
