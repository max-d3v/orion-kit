import "server-only";

import { clerkClient } from "@workspace/auth/server";
import { deleteAllByUserId as deleteAllTasksByUserId } from "@workspace/repository/entities/tasks";
import { deleteOne as deleteUserPreferences } from "@workspace/repository/entities/user-preferences";
import {
  deleteOne as deleteUser,
  getByClerkId,
  updateOne as updateUser,
} from "@workspace/repository/entities/users";
import type {
  AuthUser,
  DeleteAccountResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from "@workspace/types/use-cases/users";

export const getUser = async (clerkId: string): Promise<AuthUser> => {
  const user = await getByClerkId({ clerkId });

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    image: user.image ?? null,
    emailVerified: user.emailVerified ?? false,
  };
};

export const updateProfile = async (
  params: { userId: string } & UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  const { userId, name } = params;

  const updated = await updateUser({ clerkId: userId, name });

  return {
    id: updated.id,
    email: updated.email,
    name: updated.name ?? null,
    image: updated.image ?? null,
    emailVerified: updated.emailVerified ?? false,
  };
};

export const deleteAccount = async (params: {
  userId: string;
}): Promise<DeleteAccountResponse> => {
  const { userId } = params;

  await deleteAllTasksByUserId({ userId });
  await deleteUserPreferences({ userId });
  await deleteUser({ clerkId: userId });

  const client = await clerkClient();
  await client.users.deleteUser(userId);

  return { deleted: true };
};
