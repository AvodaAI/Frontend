import { pgTable, unique, serial, varchar, timestamp, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	clerkId: varchar("clerk_id", { length: 255 }),
	role: varchar({ length: 50 }).default('user').notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	position: varchar({ length: 255 }),
	city: varchar({ length: 255 }),
	country: varchar({ length: 255 }),
	hireDate: timestamp("hire_date", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	status: varchar({ length: 255 }).default('active'),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	token: varchar({ length: 255 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		sessionsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
		sessionsTokenUnique: unique("sessions_token_unique").on(table.token),
	}
});

export const timeLogs = pgTable("time_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	taskId: varchar("task_id", { length: 255 }).notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	durationMinutes: integer("duration_minutes"),
	organizationId: varchar("organization_id", { length: 255 }),
	createdBy: varchar("created_by", { length: 255 }),
	updatedBy: varchar("updated_by", { length: 255 }),
}, (table) => {
	return {
		timeLogsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "time_logs_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});
