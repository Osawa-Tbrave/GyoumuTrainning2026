CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"expires_at" timestamp (6) NOT NULL
);
