import { LoginCredentials, Usuario } from '../models/usuario';
import api from './api';

export const usuarioService = {
  listarTodos: () => api.get<Usuario[]>('/usuario'),
  
  obterPorId: (id: number) => api.get<Usuario>(`/usuario/${id}`),
  
  criar: (usuario: Omit<Usuario, 'id'>) => 
    api.post<Usuario>('/usuario', usuario),
  
  atualizar: (id: number, usuario: Omit<Usuario, 'id'>) =>
    api.put<Usuario>(`/usuario/${id}`, usuario),
  
  deletar: (id: number) => api.delete(`/usuario/${id}`),
  
  autenticar: (credentials: LoginCredentials) =>
    api.post('/usuario/autenticar', credentials),
}; 
