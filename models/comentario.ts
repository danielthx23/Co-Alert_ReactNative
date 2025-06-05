import { Usuario } from './usuario';
import { Postagem } from './postagem';
import { Like } from './like';

export interface Comentario {
  idComentario?: number;
  nmConteudo: string;
  dtEnvio?: Date;
  usuarioId: number;
  postagemId: number;
  idComentarioParente?: number;
  usuario?: Usuario;
  respostas?: Comentario[];
  likes?: Like[];
  postagem?: Postagem | null;
}
