import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
    var prisma: PrismaClient | undefined;
}

const db =
    globalThis.prisma ||
    new PrismaClient({
        adapter: new PrismaPg(
            new Pool({
                connectionString: process.env.DATABASE_URL,
            }),
        ),
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV === "development") {
    globalThis.prisma = db;
}

export default db;