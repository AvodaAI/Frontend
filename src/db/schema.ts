// src/db/schema.ts
import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  // Identification
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  clerk_id: varchar('clerk_id', { length: 255 }),

  // Authentication and Authorization
  email_verified: timestamp('email_verified'),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  last_login: timestamp('last_login'),

  // Employee Information
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
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
  sessions: many(sessions)
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