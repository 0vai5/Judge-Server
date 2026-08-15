import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "./env";

const { DATABASE_URL } = env;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool);

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbClient = typeof db | DbTransaction;
