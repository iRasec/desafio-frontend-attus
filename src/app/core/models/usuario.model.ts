export type TipoTelefone = 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL';

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
  tipoTelefone: TipoTelefone;
}

/** Payload usado no formulário de criação/edição (sem o id, gerado pelo backend). */
export type UsuarioFormValue = Omit<Usuario, 'id'>;
