import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { sources } from "../db/schema";

type CreateSourceInput = {
  name: string;
  size: number;
  s3Key: string;
  contentType: string;
  userId: string;
};

export const createSource = async (data: CreateSourceInput) => {
  const result = await db.insert(sources).values(data).returning();
  return result[0] || null;
};

export const findSourceById = async (id: string, userId: string) => {
  const result = await db
    .select()
    .from(sources)
    .where(and(eq(sources.id, id), eq(sources.userId, userId)));
  return result[0] || null;
};