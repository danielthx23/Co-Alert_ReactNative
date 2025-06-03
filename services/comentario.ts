import api from './api';
import { Comentario } from '../models';

export const comentarioService = {
  listarTodos: () => api.get<Comentario[]>('/comentario'),
  
  obterPorId: (id: number) => api.get<Comentario>(`/comentario/${id}`),
  
  criar: (comentario: Omit<Comentario, 'id' | 'dtCriacao'>) => 
    api.post<Comentario>('/comentario', comentario),
  
  atualizar: (id: number, comentario: Omit<Comentario, 'id' | 'dtCriacao'>) =>
    api.put<Comentario>(`/comentario/${id}`, comentario),
  
  deletar: (id: number) => api.delete(`/comentario/${id}`),
  
  obterPorPostagem: (postagemId: number) =>
    api.get<Comentario[]>(`/comentario/postagem/${postagemId}`),
  
  obterPorUsuario: (usuarioId: number) =>
    api.get<Comentario[]>(`/comentario/usuario/${usuarioId}`),
  
  obterRespostas: (comentarioId: number) =>
    api.get<Comentario[]>(`/comentario/respostas/${comentarioId}`),
}; 