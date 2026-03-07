import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Create Prisma adapter for PostgreSQL
  const adapter = new PrismaPg(pool);

  // Initialize Prisma Client with adapter (required in Prisma v7)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

// Reuse the same instance in development to prevent multiple connections
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

export { db };
export type Db = typeof db;
