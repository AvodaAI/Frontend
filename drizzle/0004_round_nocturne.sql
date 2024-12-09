ALTER TABLE "time_logs" ADD COLUMN "task_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "time_logs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "time_logs" ADD COLUMN "status" varchar(50) DEFAULT 'completed';