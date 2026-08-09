CREATE TYPE "public"."subject" AS ENUM('math', 'science', 'history', 'language', 'general', 'Chemistry', 'Physics', 'Biology', 'Geography', 'Economics', 'Political Science', 'Psychology', 'Sociology', 'Philosophy', 'Art', 'Music', 'Physical Education', 'Computer Science');--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) DEFAULT 'Untitled Session' NOT NULL,
	"subject" "subject" DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;