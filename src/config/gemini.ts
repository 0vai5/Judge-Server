import { GoogleGenAI } from "@google/genai";
import env from "./env";

const { GEMINI_API_KEY } = env;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

export const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export const GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview";