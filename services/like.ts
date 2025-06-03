import api from './api';
import { Like } from '../models';

export const likeService = {
  toggle: (like: Like) => 
    api.post('/like/toggle', like),
  
  obterPorPostagem: (postagemId: number) =>
    api.get<Like[]>(`/like/postagem/${postagemId}`),
  
  obterPorComentario: (comentarioId: number) =>
    api.get<Like[]>(`/like/comentario/${comentarioId}`),
  
  obterPorUsuario: (usuarioId: number) =>
    api.get<Like[]>(`/like/usuario/${usuarioId}`),
}; 