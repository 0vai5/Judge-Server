import { eq } from "drizzle-orm";
import { db, DbClient } from "../config/db";
import { topicResources } from "../db/schema";

type ChunkInput = {
  topicId: string;
  sourceId: string;
  userId: string;
  chunkIndex: number;
  chunkText: string;
  embedding: number[];
};

export const insertChunks = async (chunks: ChunkInput[], dbClient: DbClient = db) => {
  if (chunks.length === 0) return [];
  return dbClient.insert(topicResources).values(chunks).returning();
};

export const findChunksByTopic = async (topicId: string) => {
  return db.select().from(topicResources).where(eq(topicResources.topicId, topicId));
};