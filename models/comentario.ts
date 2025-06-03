import { Usuario } from './usuario';
import { Postagem } from './postagem';

export interface Comentario {
  idComentario?: number;
  nmConteudo: string;
  idUsuario: number;
  idPostagem: number;
  dtCriacao?: Date;

  usuario?: Usuario | null;
  postagem?: Postagem | null;
}
