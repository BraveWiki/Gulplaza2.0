import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getPrismaClient = () => {
  // Ensure DATABASE_URL is set
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    throw new Error('DATABASE_URL is required')
  }

  console.log('📋 Connecting to database:', databaseUrl.replace(/:[^:\/]+@/, ':****@'))

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const db =
  globalForPrisma.prisma ??
  globalForPrisma.prisma :
  getPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
