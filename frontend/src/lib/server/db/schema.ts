// Drizzle 側の「型付きスキーマ」

import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  task: text('task').notNull(),
  is_deleted: boolean('is_deleted').notNull().default(false),
  created_at: timestamp('created_at', { precision: 6 }).defaultNow(),
  updated_at: timestamp('updated_at', { precision: 6 }).defaultNow(),
});