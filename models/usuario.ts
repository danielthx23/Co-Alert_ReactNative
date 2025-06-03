export interface Usuario {
  idUsuario?: number;
  nmUsuario: string;
  nmEmail: string;
  nmSenha?: string;
  dtCriacao?: Date;
}

export interface LoginCredentials {
  nmEmail: string;
  nrSenha: string;
} 