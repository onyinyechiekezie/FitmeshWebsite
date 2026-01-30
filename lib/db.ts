// import { PrismaClient } from "@prisma/client"
//
// export const db = new PrismaClient()


// @ts-ignore
// import { PrismaClient } from "@prisma/client";
//
// const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClient | undefined;
// };
//
// export const prisma =
//     globalForPrisma.prisma ??
//     new PrismaClient({
//         datasourceUrl: process.env.DATABASE_URL,
//         log: ["error"],
//     });
//
// if (process.env.NODE_ENV !== "production") {
//     globalForPrisma.prisma = prisma;
//}


import { Pool } from "pg"

const useSsl = (() => {
    const sslEnv = (process.env.PGSSLMODE || "").toLowerCase()
    if (sslEnv === "require" || sslEnv === "verify-full" || sslEnv === "verify-ca") return true
    if (process.env.NODE_ENV === "production") return true
    return false
})()

const max = Number(process.env.PGPOOL_MAX || 10)
const idleTimeoutMillis = Number(process.env.PG_IDLE_TIMEOUT_MS || 30000)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max,
    idleTimeoutMillis,
})

export default pool

