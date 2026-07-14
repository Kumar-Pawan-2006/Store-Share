import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Required for serverless edge connections
neonConfig.webSocketConstructor = ws;

declare global {
  var prismaGlobalState: { prisma: PrismaClient | null } | undefined;
}

if (!globalThis.prismaGlobalState) {
  globalThis.prismaGlobalState = { prisma: null };
}

export function getDb(): PrismaClient {
  if (globalThis.prismaGlobalState?.prisma) {
    return globalThis.prismaGlobalState.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL environment variable is missing. Database connection is unavailable.");
    const client = new PrismaClient(); 
    if (globalThis.prismaGlobalState) globalThis.prismaGlobalState.prisma = client;
    return client;
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    const client = new PrismaClient({ adapter });
    if (globalThis.prismaGlobalState) globalThis.prismaGlobalState.prisma = client;
    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma Neon adapter, falling back to basic Prisma client:", error);
    const client = new PrismaClient();
    if (globalThis.prismaGlobalState) globalThis.prismaGlobalState.prisma = client;
    return client;
  }
}

export const db = getDb();
