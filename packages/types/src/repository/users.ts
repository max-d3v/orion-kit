import {
  createInsertSchema,
  createUpdateSchema,
} from "@workspace/database/drizzle-zod";
import { users } from "@workspace/database/schema";
import { z } from "zod";
import { listBaseParamsSchema } from "./base";

export const userSearchables = ["name", "email"];

export const createUserInputSchema = createInsertSchema(users);
export const updateUserInputSchema = createUpdateSchema(users).extend({
  id: z.string().uuid(),
});
export const getUserInputSchema = z.object({
  id: z.string(),
});
export const getUserByEmailInputSchema = z.object({
  email: z.string().email(),
});
export const listUsersParamsSchema = listBaseParamsSchema;
export const deleteUserParamsSchema = z.object({
  id: z.string(),
});

export type UserRawObject = typeof users.$inferSelect;

export type CreateUserParams = z.infer<typeof createUserInputSchema>;
export type UpdateUserParams = z.infer<typeof updateUserInputSchema>;
export type GetUserParams = z.infer<typeof getUserInputSchema>;
export type GetUserByEmailParams = z.infer<typeof getUserByEmailInputSchema>;
export type ListUsersParams = z.infer<typeof listUsersParamsSchema>;
export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
