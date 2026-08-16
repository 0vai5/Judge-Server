import {
  openAIClient,
  OPENROUTER_CHAT_MODEL,
  OPENROUTER_FALLBACK_MODELS,
} from "../config/openAI";
import CustomError from "http-errors";

export const callWithFallback = async (prompt: string) => {
  const models = [OPENROUTER_CHAT_MODEL, ...OPENROUTER_FALLBACK_MODELS];

  for (const model of models) {
    try {
      const response = await openAIClient.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
      const raw = response.choices[0]?.message?.content ?? "";
      if (raw.trim()) return raw;
    } catch (err) {
      console.error(`Scoring failed on model ${model}:`, err);
    }
  }

  throw CustomError(
    500,
    "All scoring models failed or returned empty responses",
  );
};
