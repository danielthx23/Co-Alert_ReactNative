import api from './api';
import { Comentario } from '../models/comentario';

export const comentarioService = {
  criar: (comentario: Comentario) =>
    api.post<Comentario>('/comentario', comentario),

  listarPorPostagem: (idPostagem: number) =>
    api.get<Comentario[]>(`/comentario/postagem/${idPostagem}`),

  buscarPorId: (id: number) =>
    api.get<Comentario>(`/comentario/${id}`),

  excluir: (id: number) =>
    api.delete(`/comentario/${id}`),

  atualizar: (comentario: Comentario) =>
    api.put<Comentario>(`/comentario/${comentario.idComentario}`, comentario),
}; 