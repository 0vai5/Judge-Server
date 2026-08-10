ALTER TABLE "topics" ALTER COLUMN "subject" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "subject" SET DEFAULT 'general'::text;--> statement-breakpoint
DROP TYPE "public"."subject";--> statement-breakpoint
CREATE TYPE "public"."subject" AS ENUM('math', 'science', 'history', 'language', 'general', 'chemistry', 'physics', 'biology', 'geography', 'economics', 'political science', 'psychology', 'sociology', 'philosophy', 'art', 'music', 'physical education', 'computer science');--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "subject" SET DEFAULT 'general'::"public"."subject";--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "subject" SET DATA TYPE "public"."subject" USING "subject"::"public"."subject";