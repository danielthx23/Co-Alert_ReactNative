import api from './api';
import { Localizacao } from '../models/localizacao';

export const localizacaoService = {
  listarTodos: () =>
    api.get<Localizacao[]>('/localizacao'),

  buscarPorId: (id: number) =>
    api.get<Localizacao>(`/localizacao/${id}`),
  
  criar: (localizacao: Omit<Localizacao, 'id'>) => 
    api.post<Localizacao>('/localizacao', localizacao),
  
  atualizar: (id: number, localizacao: Omit<Localizacao, 'id'>) =>
    api.put<Localizacao>(`/localizacao/${id}`, localizacao),
  
  deletar: (id: number) => api.delete(`/localizacao/${id}`),
  
  obterPorCidade: (cidade: string) => 
    api.get<Localizacao[]>(`/localizacao/cidade/${cidade}`),
  
  obterPorEstado: (estado: string) =>
    api.get<Localizacao[]>(`/localizacao/estado/${estado}`),
    
  obterPorCep: (cep: string) =>
    api.get<Localizacao>(`/localizacao/cep/${cep}`),
}; 