import { defineConfig } from "drizzle-kit";
import env from "./src/config/env";

const { DATABASE_URL } = env;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
