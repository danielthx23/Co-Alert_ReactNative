import { Usuario } from './usuario';
import { Postagem } from './postagem';

export interface Like {
  idUsuario: number;
  idPostagem: number;

  usuario?: Usuario | null;
  postagem?: Postagem | null;
}
