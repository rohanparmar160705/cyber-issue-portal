import { prisma } from '../utils/db';
import { RegisterDTO, User } from '../models/auth.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: RegisterDTO, passwordHash: string): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });
  }
}
