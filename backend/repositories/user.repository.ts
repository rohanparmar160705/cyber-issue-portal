import { prisma } from '../utils/db';
import { RegisterDTO, User } from '../models/auth.model';

export class UserRepository {
  // Find a user by email
  // Takes: email (string)
  // Returns: User object or null if not found
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  // Create a new user
  // Takes: RegisterDTO and hashed password
  // Returns: the newly created User object
  async createUser(data: RegisterDTO, passwordHash: string): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });
  }

  // Find a user by ID
  // Takes: id (number)
  // Returns: User object or null if not found
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  // Update user fields (name and/or email)
  // Takes: id (number) and partial user data to update
  // Returns: updated User object
  async updateUser(
    id: number,
    data: { name?: string; email?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

/*
  Purpose:

  - Provides database access for the User entity using Prisma.
  - Acts as a repository between controllers/services and the database.
  - Centralizes all user CRUD operations for easier maintenance.

  Notes:

  - Methods return User objects (or null).
  - Passwords should be hashed before calling createUser.
  - updateUser accepts partial fields (name and/or email).
*/


