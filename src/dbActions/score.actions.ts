import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { scores } from "../db/schema";

type CreateScoreInput = {
  sessionId: string;
  clarity: number;
  completeness: number;
  correctness: number;
  gaps: string[];
  suggestedRevisitPoints: string[];
};

export const createScore = async (data: CreateScoreInput) => {
  const result = await db.insert(scores).values(data).returning();
  return result[0] || null;
};

export const findScoreBySession = async (sessionId: string) => {
  const result = await db
    .select()
    .from(scores)
    .where(eq(scores.sessionId, sessionId));
  return result[0] || null;
};