import { db, eq } from "@workspace/database/client";
import { users } from "@workspace/database/schema";
import { HttpError } from "@workspace/types/errors/http";
import type {
  CreateUserParams,
  GetUserByClerkIdParams,
  UpdateUserParams,
  UserRawObject,
} from "@workspace/types/repository/users";

export const getByClerkId = async (
  params: GetUserByClerkIdParams
): Promise<UserRawObject> => {
  const { clerkId } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const create = async (
  params: CreateUserParams
): Promise<UserRawObject> => {
  const result = await db.insert(users).values(params).returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(500, "Failed to create user");
  }

  return user;
};

export const upsertByClerkId = async (
  params: CreateUserParams
): Promise<UserRawObject> => {
  const { clerkId, ...rest } = params;

  const result = await db
    .insert(users)
    .values({ clerkId, ...rest })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { ...rest, updatedAt: new Date() },
    })
    .returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(500, "Failed to upsert user");
  }

  return user;
};

export const updateOne = async (
  params: UpdateUserParams
): Promise<UserRawObject> => {
  const { clerkId, ...data } = params;

  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const deleteOne = async (
  params: GetUserByClerkIdParams
): Promise<UserRawObject> => {
  const { clerkId } = params;

  const result = await db
    .delete(users)
    .where(eq(users.clerkId, clerkId))
    .returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};
