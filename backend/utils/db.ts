import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/*
  Purpose:

  - Initializes and exports a singleton PrismaClient instance
  - Ensures only one client is created during development
  - Provides database access throughout the application
*/

