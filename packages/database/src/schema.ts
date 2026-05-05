import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// biome-ignore lint/performance/noNamespaceImport: This is auto generated on top of we always using all the schemas.
import * as authSchema from "./auth-schema";

export * from "./auth-schema";

export const tasktatusEnum = pgEnum("task_status", [
  "todo",
  "in-progress",
  "completed",
  "cancelled",
]);

export const organizationRole = pgEnum("organization_roles", [
  "owner",
  "admin",
  "member",
]);

export const userPreference = pgTable("user_preferences", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),

  theme: varchar({ length: 50 }).default("system"),
  language: varchar({ length: 10 }).default("en"),
  timezone: varchar({ length: 100 }),

  defaultTaskStatus: varchar("default_task_status", { length: 50 }).default(
    "todo"
  ),

  emailNotifications: varchar("email_notifications", { length: 50 }).default(
    "enabled"
  ),
  taskReminders: varchar("task_reminders", { length: 50 }).default("enabled"),
  weeklyDigest: varchar("weekly_digest", { length: 50 }).default("disabled"),
  pushNotifications: varchar("push_notifications", { length: 50 }).default(
    "disabled"
  ),

  plan: varchar({ length: 50 }).default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeSubscriptionStatus: varchar("stripe_subscription_status", {
    length: 50,
  }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const task = pgTable("task", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),

  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: tasktatusEnum().default("todo").notNull(),

  priority: integer("priority").default(0),

  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userPreferenceRelations = relations(userPreference, ({ one }) => ({
  user: one(authSchema.user, {
    fields: [userPreference.userId],
    references: [authSchema.user.id],
  }),
}));

export const taskRelations = relations(task, ({ one }) => ({
  user: one(authSchema.user, {
    fields: [task.userId],
    references: [authSchema.user.id],
  }),
}));

export const schema = {
  userPreference,
  task,
  userPreferenceRelations,
  taskRelations,
  ...authSchema,
};
