import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario, UsuarioFormValue } from '../models/usuario.model';

/**
 * Serviço de usuários com dados mockados em memória, simulando latência de
 * rede (delay) para exercitar loading/erro no componente de listagem.
 *
 * Em um cenário real, os métodos abaixo chamariam `HttpClient` contra a API
 * REST (ex: `this.http.get<Usuario[]>('/api/usuarios')`); a assinatura
 * pública (retorno Observable) foi mantida idêntica de propósito, para que
 * a troca pelo backend real não exija alterar nenhum componente.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private proximoId = 2;

  private readonly usuarios = signal<Usuario[]>([
    {
      id: 1,
      nome: 'Giana Sandrini',
      email: 'giana@attornatus.com.br',
      cpf: '000.000.000-00',
      telefone: '(45) 99999-0000',
      tipoTelefone: 'CELULAR',
    },
  ]);

  listar(filtroNome = ''): Observable<Usuario[]> {
    const termo = filtroNome.trim().toLowerCase();
    const resultado = termo
      ? this.usuarios().filter((u) => u.nome.toLowerCase().includes(termo))
      : this.usuarios();

    // simula latência de rede (~400ms)
    return of(resultado).pipe(delay(400));
  }

  criar(dados: UsuarioFormValue): Observable<Usuario> {
    const novo: Usuario = { id: this.proximoId++, ...dados };
    this.usuarios.update((atual) => [...atual, novo]);
    return of(novo).pipe(delay(400));
  }

  atualizar(id: number, dados: UsuarioFormValue): Observable<Usuario> {
    const existente = this.usuarios().find((u) => u.id === id);
    if (!existente) {
      return throwError(() => new Error('Usuário não encontrado.'));
    }
    const atualizado: Usuario = { id, ...dados };
    this.usuarios.update((atual) => atual.map((u) => (u.id === id ? atualizado : u)));
    return of(atualizado).pipe(delay(400));
  }
}
