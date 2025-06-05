import api from './api';
import { CategoriaDesastre } from '../models/categoriaDesastre';

export const categoriaDesastreService = {
  listarTodos: () =>
    api.get<CategoriaDesastre[]>('/categoria-desastre'),

  obterPorId: (id: number) =>
    api.get<CategoriaDesastre>(`/categoria-desastre/${id}`),
  
  criar: (categoria: Omit<CategoriaDesastre, 'idCategoriaDesastre'>) => 
    api.post<CategoriaDesastre>('/categoria-desastre', categoria),
  
  atualizar: (id: number, categoria: Omit<CategoriaDesastre, 'idCategoriaDesastre'>) =>
    api.put<CategoriaDesastre>(`/categoria-desastre/${id}`, categoria),
  
  deletar: (id: number) => api.delete(`/categoria-desastre/${id}`),
  
  obterPorTipo: (tipo: string) => 
    api.get<CategoriaDesastre[]>(`/categoria-desastre/tipo/${tipo}`),
  
  obterPorTitulo: (titulo: string) =>
    api.get<CategoriaDesastre[]>(`/categoria-desastre/titulo/${titulo}`),
}; 