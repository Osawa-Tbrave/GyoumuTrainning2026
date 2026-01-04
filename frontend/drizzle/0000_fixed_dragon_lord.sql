CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"task" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (6) DEFAULT now(),
	"updated_at" timestamp (6) DEFAULT now()
);
