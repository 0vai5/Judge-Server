import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "./env";

const { DATABASE_URL } = env;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool);
