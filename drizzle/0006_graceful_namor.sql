CREATE TABLE "topic_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"embedding" vector(2048) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topic_references" ADD CONSTRAINT "topic_references_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;