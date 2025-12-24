// Represents a user in the system (database model)
export interface User {
  id: number;
  email: string;
  passwordHash: string; // hashed password
  name?: string | null;
  createdAt: Date;
}

// Data required for user registration
export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

// Data required for user login
export interface LoginDTO {
  email: string;
  password: string;
}

// User data returned in responses (without password)
export interface UserDTO {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
}
