// src/scripts/testScoring.ts
import { openAIClient, OPENROUTER_CHAT_MODEL, OPENROUTER_FALLBACK_MODELS } from "../config/openAI";

const SAMPLE_TRANSCRIPT = `
Student explanation: "So basically photosynthesis is when plants use sunlight
to make food. They take in CO2 and water, and the sunlight helps convert it
into glucose. Oh and oxygen comes out too as a byproduct."
`;

const SCORING_PROMPT = `
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
${SAMPLE_TRANSCRIPT}
`;

async function run() {
  try {
    const response = await openAIClient.chat.completions.create({
      model: OPENROUTER_CHAT_MODEL,
      messages: [{ role: "user", content: SCORING_PROMPT }],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    console.log("Raw response:\n", raw);

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    console.log("Parsed score:\n", parsed);
  } catch (err) {
    console.error("Scoring test failed:", err);
  }
}

run();