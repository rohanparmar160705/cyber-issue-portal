import { PrismaClient } from '@prisma/client';

// Avoid multiple instances of PrismaClient in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use existing PrismaClient if available, otherwise create a new one
export const prisma = globalForPrisma.prisma || new PrismaClient();

// In non-production environments, attach PrismaClient to global
// to prevent creating multiple instances during hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/*
  Purpose:

  - Initializes and exports a singleton PrismaClient instance
  - Ensures only one client is created during development
  - Provides database access throughout the application
*/
