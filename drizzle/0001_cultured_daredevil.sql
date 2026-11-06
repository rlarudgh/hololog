CREATE TABLE "short_urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_code" text NOT NULL,
	"original_url" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "short_urls_short_code_unique" UNIQUE("short_code"),
	CONSTRAINT "short_urls_original_url_unique" UNIQUE("original_url")
);
--> statement-breakpoint
ALTER TABLE "short_urls" ENABLE ROW LEVEL SECURITY;