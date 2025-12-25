import { z } from "zod";
import { RegisterDTO, LoginDTO } from "../models/auth.model";

export class AuthValidator {
  // Zod schema for registration data
  static registerSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    name: z.string().optional(),
  });

  // Zod schema for login data
  static loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  // Validate registration data
  // Takes: any input object
  // Returns: RegisterDTO if valid, throws if invalid
  static validateRegister(data: any): RegisterDTO {
    return this.registerSchema.parse(data);
  }

  // Validate login data
  // Takes: any input object
  // Returns: LoginDTO if valid, throws if invalid
  static validateLogin(data: any): LoginDTO {
    return this.loginSchema.parse(data);
  }
}

/*
  Purpose:

  - Validates auth input data using Zod
  - Ensures correct structure and types for registration and login
  - Returns typed DTOs for use in services/controllers
*/

