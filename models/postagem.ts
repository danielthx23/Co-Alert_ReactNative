import { Usuario } from './usuario';
import { CategoriaDesastre } from './categoriaDesastre';
import { Localizacao } from './localizacao';

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
}
