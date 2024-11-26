DROP TABLE "employees" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "position" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hire_date" timestamp;