import { eq } from "drizzle-orm";
import CustomError from "http-errors";
import { db } from "../config/db";
import { scores, sessions } from "../db/schema";

type ScoreInput = {
  clarity: number;
  completeness: number;
  correctness: number;
  gaps: string[];
  suggestedRevisitPoints: string[];
};

// --- Step: the actual guard — session must be "completed" before scoring ---
export const createScore = async (sessionId: string, data: ScoreInput) => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));

  if (!session) {
    throw CustomError(404, "Session not found");
  }
  if (session.status !== "completed") {
    throw CustomError(
      400,
      "Cannot score a session that hasn't ended yet",
    );
  }

  const values: typeof scores.$inferInsert = { sessionId, ...data };
  const result = await db.insert(scores).values(values).returning();
  return result[0] || null;
};

export const findScoreBySession = async (sessionId: string) => {
  const result = await db
    .select()
    .from(scores)
    .where(eq(scores.sessionId, sessionId));
  return result[0] || null;
};