import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { topics } from "../db/schema";
import { Subject } from "../types/topics.types";

type Values = {
  userId: string;
  subject?: Subject;
};

export const createTopic = async (userId: string, subject?: Subject) => {
  const values: typeof topics.$inferInsert = { userId };
  if (subject) values.subject = subject;

  const result = await db.insert(topics).values(values).returning();
  return result[0] || null;
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
