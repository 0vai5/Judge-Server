import { eq, asc, and } from "drizzle-orm";
import { db } from "../config/db";
import { transcriptMessages } from "../db/schema";

type CreateMessageInput = {
  sessionId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
};

export const createTranscriptMessage = async (data: CreateMessageInput) => {
  const result = await db.insert(transcriptMessages).values(data).returning();
  return result[0] || null;
};

export const findMessagesBySession = async (sessionId: string) => {
  return db
    .select()
    .from(transcriptMessages)
    .where(eq(transcriptMessages.sessionId, sessionId))
    .orderBy(asc(transcriptMessages.createdAt));
};

export const findFirstUserMessageBySession = async (sessionId: string) => {
  const [message] = await db
    .select()
    .from(transcriptMessages)
    .where(
      and(
        eq(transcriptMessages.sessionId, sessionId),
        eq(transcriptMessages.role, "user"),
      ),
    )
    .orderBy(asc(transcriptMessages.createdAt))
    .limit(1);

  return message ?? null;
};
