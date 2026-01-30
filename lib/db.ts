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

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export default pool

