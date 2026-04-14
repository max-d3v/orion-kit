import { users } from "@workspace/database/schema";
import { z } from "zod";

export type UserRawObject = typeof users.$inferSelect;

export const createUserParamsSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  emailVerified: z.boolean().optional(),
});

export const updateUserParamsSchema = z.object({
  clerkId: z.string(),
  name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  emailVerified: z.boolean().optional(),
});

export const getUserByClerkIdParamsSchema = z.object({
  clerkId: z.string(),
});

export type CreateUserParams = z.infer<typeof createUserParamsSchema>;
export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;
export type GetUserByClerkIdParams = z.infer<typeof getUserByClerkIdParamsSchema>;
