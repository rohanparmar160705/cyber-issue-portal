import { z } from 'zod';
import { RegisterDTO, LoginDTO } from '../models/auth.model';

export class AuthValidator {
  
  static registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
  });

  static loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  static validateRegister(data: any): RegisterDTO {
    return this.registerSchema.parse(data);
  }

  static validateLogin(data: any): LoginDTO {
    return this.loginSchema.parse(data);
  }
}
