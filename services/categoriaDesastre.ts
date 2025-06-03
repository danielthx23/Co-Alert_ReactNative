import api from './api';
import { CategoriaDesastre } from '../models';

export const categoriaDesastreService = {
  listarTodos: () => api.get<CategoriaDesastre[]>('/categoria-desastre'),
  
  obterPorId: (id: number) => api.get<CategoriaDesastre>(`/categoria-desastre/${id}`),
  
  criar: (categoria: Omit<CategoriaDesastre, 'id'>) => 
    api.post<CategoriaDesastre>('/categoria-desastre', categoria),
  
  atualizar: (id: number, categoria: Omit<CategoriaDesastre, 'id'>) =>
    api.put<CategoriaDesastre>(`/categoria-desastre/${id}`, categoria),
  
  deletar: (id: number) => api.delete(`/categoria-desastre/${id}`),
  
  obterPorTipo: (tipo: string) => 
    api.get<CategoriaDesastre[]>(`/categoria-desastre/tipo/${tipo}`),
  
  obterPorTitulo: (titulo: string) =>
    api.get<CategoriaDesastre[]>(`/categoria-desastre/titulo/${titulo}`),
}; 