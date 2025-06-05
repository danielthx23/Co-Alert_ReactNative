import { Usuario } from './usuario';
import { Postagem } from './postagem';

export interface Like {
  idLike?: number;
  usuarioId: number;
  postagemId?: number;
  comentarioId?: number;
  dtCriacao?: Date;

  usuario?: Usuario | null;
  postagem?: Postagem | null;
}
