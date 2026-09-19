import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/usuarios/usuario-list/usuario-list.component').then(
        (m) => m.UsuarioListComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
