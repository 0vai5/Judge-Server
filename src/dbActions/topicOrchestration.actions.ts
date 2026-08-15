import { db, DbClient } from "../config/db";
import { topics, sessions, transcriptMessages } from "../db/schema";
import { Subject } from "../schemas/topic.schema";

type CreateTopicWithSessionInput = {
  userId: string;
  title: string;
  subject: Subject;
  userMessage: string;
};

export const createTopicWithSessionAndMessage = async (
  input: CreateTopicWithSessionInput,
  dbClient: DbClient = db,
) => {
  const [topic] = await dbClient
    .insert(topics)
    .values({ userId: input.userId, title: input.title, subject: input.subject })
    .returning();
  if (!topic) throw new Error("Failed to create topic");

  const [session] = await dbClient
    .insert(sessions)
    .values({ userId: input.userId, topicId: topic.id })
    .returning();
  if (!session) throw new Error("Failed to create session");

  const [message] = await dbClient
    .insert(transcriptMessages)
    .values({
      sessionId: session.id,
      userId: input.userId,
      role: "user",
      content: input.userMessage,
    })
    .returning();

  return { topic, session, message };
};