import OpenAI from "openai";
import env from "./env";

const { OPENROUTER_API_KEY, OPENROUTER_URL } = env;

if (!OPENROUTER_API_KEY || !OPENROUTER_URL) {
  throw new Error(
    "OPENROUTER_API_KEY or OPENROUTER_URL is not set in environment variables",
  );
}

export const openAIClient = new OpenAI({
  baseURL: OPENROUTER_URL,
  apiKey: OPENROUTER_API_KEY,
});

export const OPENROUTER_CHAT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
export const OPENROUTER_FALLBACK_MODELS = [
  "openai/gpt-oss-20b:free",
  "inclusionai/ling-3.0-flash:free",
];
export const OPENROUTER_EMBEDDING_MODEL = "nvidia/nemotron-3-embed-1b:free";
