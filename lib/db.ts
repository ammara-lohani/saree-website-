import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const defaultDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    try {
      if (fs.existsSync(defaultDbPath) && !fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(defaultDbPath, tmpDbPath);
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error('Failed to copy SQLite database to /tmp for Vercel:', e);
    }
  }

  return `file:${defaultDbPath}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
