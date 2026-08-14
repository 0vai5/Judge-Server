CREATE TABLE "topic_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"chunk_text" text NOT NULL,
	"embedding" vector(2048) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topic_references" RENAME TO "sources";--> statement-breakpoint
ALTER TABLE "sources" DROP CONSTRAINT "topic_references_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "s3_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "content_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_resources" ADD CONSTRAINT "topic_resources_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_resources" ADD CONSTRAINT "topic_resources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_resources" ADD CONSTRAINT "topic_resources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "topic_id";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "embedding";