export interface Usuario {
  idUsuario?: number;
  nmUsuario: string;
  nmEmail: string;
  nrSenha?: string;
  dtCriacao?: Date;
  tokenProvisorio?: string;
}

export interface LoginCredentials {
  nmEmail: string;
  nrSenha: string;
}

export interface LoginResponse {
  usuario: Usuario;
  tokenProvisorio: string;
} 