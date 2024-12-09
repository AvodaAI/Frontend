// src/db/schema.ts
import { pgTable, serial, varchar, timestamp, text, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  // Identification
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  clerk_id: varchar('clerk_id', { length: 255 }),

  // Authentication and Authorization
  email_verified: timestamp('email_verified'),
  role: varchar('role', { length: 50 }).notNull().default('employee'),
  last_login: timestamp('last_login'),

  // Employee Information
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
  status: varchar('status', { length: 255 }).notNull().default('active'),
  position: text('position'),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  task_id: varchar('task_id', { length: 255 }).notNull(),
  description: text('description'), // Optional description tracking
  organization_id: varchar('organization_id', { length: 255 }),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time'),
  duration_minutes: integer('duration_minutes'),
  status: varchar('status', { length: 50 }).default('completed'), // Optional status tracking
  locked: boolean('locked').notNull().default(false),
  locked_time: timestamp('locked_time'),
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