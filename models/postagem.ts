import { Usuario } from './usuario';
import { CategoriaDesastre } from './categoriaDesastre';
import { Localizacao } from './localizacao';
import { Like } from './like';
import { Comentario } from './comentario';

export interface Postagem {
  idPostagem?: number;
  nmTitulo: string;
  nmConteudo: string;
  dtEnvio?: Date;
  usuario?: Usuario;
  usuarioId: number;
  categoriaDesastre?: CategoriaDesastre;
  categoriaDesastreId: number;
  localizacao?: Localizacao;
  localizacaoId: number;
  comentarios?: Comentario[];
  nrLikes: number;
}
