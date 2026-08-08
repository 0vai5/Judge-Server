import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../db/schema";

export const findUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};

export const createUser = async (name: string, email: string, password: string) => {
  const result = await db.insert(users).values({ name, email, password }).returning();
  return result[0] || null;
}

export const findUserById = async (id: string) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}