export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name?: string | null;
  createdAt: Date;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
}
