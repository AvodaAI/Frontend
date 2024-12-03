import { relations } from "drizzle-orm/relations";
import { users, sessions, timeLogs } from "./schema";

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	timeLogs: many(timeLogs),
}));

export const timeLogsRelations = relations(timeLogs, ({one}) => ({
	user: one(users, {
		fields: [timeLogs.userId],
		references: [users.id]
	}),
}));