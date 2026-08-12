import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const subjectEnum = pgEnum("subject", [
  "math",
  "science",
  "history",
  "language",
  "general",
  "chemistry",
  "physics",
  "biology",
  "geography",
  "economics",
  "political science",
  "psychology",
  "sociology",
  "philosophy",
  "art",
  "music",
  "physical education",
  "computer science",
]);
export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "completed",
  "abandoned",
]);
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 })
    .default("Untitled Session")
    .notNull(),
  subject: subjectEnum("subject").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  topicId: uuid("topic_id")
    .references(() => topics.id)
    .notNull(),
  status: sessionStatusEnum("status").default("active").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

export const aiQuestionsAsked = pgTable("ai_questions_asked", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  concept: varchar("concept", { length: 255 }).notNull(),
  question: text("question").notNull(),
  askedAt: timestamp("asked_at").defaultNow().notNull(),
});

export const scores = pgTable("scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull()
    .unique(), // one score record per session
  clarity: integer("clarity").notNull(),
  completeness: integer("completeness").notNull(),
  correctness: integer("correctness").notNull(),
  gaps: text("gaps").array().notNull(), // matches testScoring.ts's gaps: string[]
  suggestedRevisitPoints: text("suggested_revisit_points").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const transcriptMessages = pgTable("transcript_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});