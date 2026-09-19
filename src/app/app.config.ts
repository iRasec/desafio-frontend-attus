import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { todoReducer } from './state/todo/todo.reducer';
import { TodoEffects } from './state/todo/todo.effects';

/**
 * Configuração global standalone da aplicação.
 * A feature "todo" (NgRx) é registrada aqui apenas para fins de
 * demonstração da questão 3.2 — a tela de usuários (desafio 4) usa Signals.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore({ todos: todoReducer }),
    provideEffects([TodoEffects]),
  ],
};
