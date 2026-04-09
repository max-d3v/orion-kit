import {
  createInsertSchema,
  createUpdateSchema,
} from "@workspace/database/drizzle-zod";
import { userPreferences } from "@workspace/database/schema";
import { z } from "zod";

export const createUserPreferenceInputSchema =
  createInsertSchema(userPreferences);
export const updateUserPreferenceInputSchema = createUpdateSchema(
  userPreferences
).extend({
  userId: z.string(),
});
export const getUserPreferenceInputSchema = z.object({
  userId: z.string(),
});
export const deleteUserPreferenceParamsSchema = z.object({
  userId: z.string(),
});

export type UserPreferenceRawObject = typeof userPreferences.$inferSelect;

export type CreateUserPreferenceParams = z.infer<
  typeof createUserPreferenceInputSchema
>;
export type UpdateUserPreferenceParams = z.infer<
  typeof updateUserPreferenceInputSchema
>;
export type GetUserPreferenceParams = z.infer<
  typeof getUserPreferenceInputSchema
>;
export type DeleteUserPreferenceParams = z.infer<
  typeof deleteUserPreferenceParamsSchema
>;

export type UpdatePreferencesInput = Partial<
  Omit<UserPreferenceRawObject, "id" | "userId" | "createdAt" | "updatedAt">
>;

export type PreferencesResponse = UserPreferenceRawObject;
export type UpdatePreferencesResponse = UserPreferenceRawObject;
