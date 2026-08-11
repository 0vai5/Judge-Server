import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { sessions } from "../db/schema";

export const createSession = async (userId: string, topicId: string) => {
  const values: typeof sessions.$inferInsert = { userId, topicId };
  const result = await db.insert(sessions).values(values).returning();
  return result[0] || null;
};

export const findSessionsByUser = async (userId: string) => {
  return db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.isDeleted, false)));
};

export const findSessionById = async (id: string, userId: string) => {
  const result = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, id),
        eq(sessions.userId, userId),
        eq(sessions.isDeleted, false),
      ),
    );
  return result[0] || null;
};

// --- Step: append/replace transcript as the live session streams ---
export const updateSessionTranscript = async (
  id: string,
  userId: string,
  transcript: string,
) => {
  const result = await db
    .update(sessions)
    .set({ transcript, updatedAt: new Date() })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
    .returning();
  return result[0] || null;
};

// --- Step: only valid transition is active -> completed/abandoned ---
export const endSession = async (
  id: string,
  userId: string,
  status: "completed" | "abandoned",
) => {
  const result = await db
    .update(sessions)
    .set({ status, endedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
    .returning();
  return result[0] || null;
};

export const softDeleteSession = async (id: string, userId: string) => {
  const result = await db
    .update(sessions)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
    .returning();
  return result[0] || null;
};