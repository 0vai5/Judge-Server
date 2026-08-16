import {
  openAIClient,
  OPENROUTER_CHAT_MODEL,
  OPENROUTER_FALLBACK_MODELS,
} from "../config/openAI";
import { findMessagesBySession } from "../dbActions/transcriptMessage.actions";
import { createScore, findScoreBySession } from "../dbActions/score.actions";
import CustomError from "http-errors";
import { callWithFallback } from "./openAI.service";

type ScoreResult = {
  clarity: number;
  completeness: number;
  correctness: number;
  gaps: string[];
  suggestedRevisitPoints: string[];
};

const buildScoringPrompt = (transcript: string) => `
You are an expert tutor evaluating a student's spoken explanation of a topic.
Score the following explanation on three dimensions: clarity, completeness, correctness.
Each score is 1-10. Also list specific gaps (things left vague or missing).

Respond ONLY with valid JSON, no markdown, no preamble:
{
  "clarity": number,
  "completeness": number,
  "correctness": number,
  "gaps": string[],
  "suggestedRevisitPoints": string[]
}

Transcript:
${transcript}
`;

const isValidScoreShape = (value: any): value is ScoreResult => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.clarity === "number" &&
    typeof value.completeness === "number" &&
    typeof value.correctness === "number" &&
    Array.isArray(value.gaps) &&
    Array.isArray(value.suggestedRevisitPoints)
  );
};


export const scoreSession = async (sessionId: string) => {
  const existing = await findScoreBySession(sessionId);
  if (existing) return existing;

  const messages = await findMessagesBySession(sessionId);
  const userMessages = messages.filter((m) => m.role === "user");

  if (userMessages.length === 0) {
    throw CustomError(404, "No user explanation found to score");
  }

  const transcript = userMessages.map((m) => m.content).join("\n");
  const prompt = buildScoringPrompt(transcript);

  const raw = await callWithFallback(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw CustomError(500, "Scoring model returned invalid JSON");
  }

  if (!isValidScoreShape(parsed)) {
    throw CustomError(500, "Scoring model returned an unexpected shape");
  }

  return createScore({
    sessionId,
    clarity: parsed.clarity,
    completeness: parsed.completeness,
    correctness: parsed.correctness,
    gaps: parsed.gaps,
    suggestedRevisitPoints: parsed.suggestedRevisitPoints,
  });
};
