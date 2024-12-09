ALTER TABLE "time_logs" ADD COLUMN "locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "time_logs" ADD COLUMN "locked_time" timestamp;--> statement-breakpoint
ALTER TABLE "time_logs" DROP COLUMN IF EXISTS "task_name";