import api from './api';
import { Like } from '../models/like';

interface LikeResponse {
  totalLikes: number;
  isLiked: boolean;
}

interface LikeToggleRequest {
  usuarioId: number;
  postagemId?: number;
  comentarioId?: number;
}

export const likeService = {
  toggle: (data: LikeToggleRequest) => api.post<LikeResponse>('/like/toggle', data),
  
  obterPorPostagem: (postagemId: number, usuarioId: number) => 
    api.get<LikeResponse>(`/like/postagem/${postagemId}?usuarioId=${usuarioId}`),
  
  obterPorComentario: (comentarioId: number, usuarioId: number) => 
    api.get<LikeResponse>(`/like/comentario/${comentarioId}?usuarioId=${usuarioId}`),
  
  obterPorUsuario: (usuarioId: number) => 
    api.get<Like[]>(`/like/usuario/${usuarioId}`)
}; 