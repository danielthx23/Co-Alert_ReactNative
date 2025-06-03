import api from './api';
import { Postagem } from '../models/postagem';

export const postagemService = {
  listarTodos: () => api.get<Postagem[]>('/postagem'),
  
  obterPorId: (id: number) => api.get<Postagem>(`/postagem/${id}`),
  
  criar: (postagem: Omit<Postagem, 'id' | 'dtEnvio'>) => api.post('/postagem', postagem),
  
  atualizar: (id: number, postagem: Partial<Postagem>) => api.put(`/postagem/${id}`, postagem),
  
  deletar: (id: number) => api.delete(`/postagem/${id}`),
  
  obterPorUsuario: (usuarioId: number) =>
    api.get<Postagem[]>(`/postagem/usuario/${usuarioId}`),
  
  obterPorCategoria: (categoriaId: number) =>
    api.get<Postagem[]>(`/postagem/categoria-desastre/${categoriaId}`),
  
  obterPorLocalizacao: (localizacaoId: number) =>
    api.get<Postagem[]>(`/postagem/localizacao/${localizacaoId}`),
}; 