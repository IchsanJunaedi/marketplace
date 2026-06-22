import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma(): PrismaClient {
  // TiDB Cloud is MySQL-compatible — the mariadb adapter speaks the same
  // protocol. Connection details come from DATABASE_URL.
  const url = new URL(process.env.DATABASE_URL ?? "mysql://localhost:3306/db");
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: url.searchParams.get("sslaccept") ? {} : undefined,
    connectionLimit: 5,
    connectTimeout: 15000, // 15 seconds to allow cross-region connection during build (US to Singapore)
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
