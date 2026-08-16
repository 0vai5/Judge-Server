import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { sessions, topics } from "../db/schema";
import { Subject } from "../schemas/topic.schema";

type Values = {
  userId: string;
  subject?: Subject;
};

export const findTopicsByUser = async (userId: string) => {
  return db
    .select()
    .from(topics)
    .where(and(eq(topics.userId, userId), eq(topics.isDeleted, false)));
};

export const findTopicById = async (id: string, userId: string) => {
  const result = await db
    .select()
    .from(topics)
    .where(
      and(
        eq(topics.id, id),
        eq(topics.userId, userId),
        eq(topics.isDeleted, false),
      ),
    );
  return result[0] || null;
};

export const updateTopic = async (
  id: string,
  userId: string,
  data: Partial<{ title: string; subject: Subject }>,
) => {
  const result = await db
    .update(topics)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(topics.id, id), eq(topics.userId, userId)))
    .returning();
  return result[0] || null;
};

export const softDeleteTopic = async (id: string, userId: string) => {
  const result = await db
    .update(topics)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(and(eq(topics.id, id), eq(topics.userId, userId)))
    .returning();
  return result[0] || null;
};

export const updateTopicBySessionID = async (
  sessionId: string,
  userId: string,
  data: Partial<{ title: string; subject: Subject }>,
) => {
  const session = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
  if (!session || session.length === 0) {
    throw new Error("Session not found for the given sessionId and userId");
  }

  const result = await db
    .update(topics)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(topics.id, session[0].topicId), eq(topics.userId, userId)))
    .returning();
  return result[0] || null;
};
