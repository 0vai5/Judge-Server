import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  NODE_ENV,
  CORS_ORIGIN,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  OPENROUTER_API_KEY,
  OPENROUTER_URL,
  DATABASE_URL,
  GEMINI_API_KEY
} = process.env;

const env = {
  PORT: PORT || 5000,
  NODE_ENV: NODE_ENV || "development",
  CORS_ORIGIN: CORS_ORIGIN || "*",
  JWT_SECRET: JWT_SECRET || "your_jwt_secret_key",
  JWT_EXPIRES_IN: JWT_EXPIRES_IN || "1d",
  OPENROUTER_API_KEY: OPENROUTER_API_KEY || "",
  OPENROUTER_URL: OPENROUTER_URL || "",
  DATABASE_URL: DATABASE_URL || "",
  GEMINI_API_KEY: GEMINI_API_KEY || ""
};

export default env;
