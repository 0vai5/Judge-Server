import { openAIClient, OPENROUTER_EMBEDDING_MODEL } from "../config/openAI";
import CustomError from "http-errors";

export const generateEmbeddings = async (text: string): Promise<number[]> => {
  if (!text || text.trim().length === 0) {
    throw CustomError(400, "Cannot embed empty text")
  }

  const response = await openAIClient.embeddings.create({
    model: OPENROUTER_EMBEDDING_MODEL,
    input: text,
    dimensions: 2048,
    encoding_format: "float",
  });

  const values = response.data?.[0]?.embedding;

  if (!values) {
    throw CustomError(
      500,
      "Failed to retrieve embedding from OpenAI response.",
    );
  }

  return values;
};
