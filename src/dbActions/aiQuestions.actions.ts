import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { aiQuestionsAsked } from "../db/schema";

type CreateQuestionInput = {
  sessionId: string;
  subject: string;
  concept: string;
  question: string;
};

export const createAiQuestion = async (data: CreateQuestionInput) => {
  const result = await db.insert(aiQuestionsAsked).values(data).returning();
  return result[0] || null;
};

export const findQuestionsBySession = async (sessionId: string) => {
  return db
    .select()
    .from(aiQuestionsAsked)
    .where(eq(aiQuestionsAsked.sessionId, sessionId))
    .orderBy(aiQuestionsAsked.askedAt);
};

export const findAiQuestionById = async (id: string) => {
  const result = await db
    .select()
    .from(aiQuestionsAsked)
    .where(eq(aiQuestionsAsked.id, id));
  return result[0] || null;
};

export const deleteAiQuestion = async (id: string, sessionId: string) => {
  const result = await db
    .delete(aiQuestionsAsked)
    .where(
      and(eq(aiQuestionsAsked.id, id), eq(aiQuestionsAsked.sessionId, sessionId)),
    )
    .returning();
  return result[0] || null;
};