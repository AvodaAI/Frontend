// src/db/schema.ts
import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  // Identification
  id: integer('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  auth_id: varchar('auth_id', { length: 255 }), //UID from {Supabase}

  // Authentication and Authorization
  email_verified: timestamp('email_verified'),
  role: varchar('role', { length: 50 }).notNull().default('employee'),
  last_login: timestamp('last_login'),

  // Employee Information
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
  status: varchar('status', { length: 255 }).notNull().default('active'),
  position: varchar('position', { length: 255 }),
  city: varchar('city', { length: 255 }),
  country: varchar('country', { length: 255 }),
  hire_date: timestamp('hire_date'),

  // Timestamps
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// Relations and indexes
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  timeLogs: many(timeLogs)
}));

export const sessions = pgTable('sessions', {
  id: integer('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));

export const timeLogs = pgTable('time_logs', {
  id: integer('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  task_id: varchar('task_id', { length: 255 }).notNull(),
  organization_id: varchar('organization_id', { length: 255 }),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time'),
  duration_minutes: integer('duration_minutes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  created_by: varchar('created_by', { length: 255 }),
  updated_by: varchar('updated_by', { length: 255 }),
});

export const timeLogsRelations = relations(timeLogs, ({ one }) => ({
  user: one(users, {
    fields: [timeLogs.user_id],
    references: [users.id],
  }),
}));