import {
  getOrCreate,
  updateOne,
} from "@workspace/repository/entities/user-preferences";
import type { UpdatePreferencesInput } from "@workspace/types/repository/user-preferences";

export const getOrCreatePreferences = async (params: { userId: string }) => {
  const { userId } = params;
  return await getOrCreate({ userId });
};

export const updatePreferences = async (params: {
  userId: string;
  data: UpdatePreferencesInput;
}) => {
  const { userId, data } = params;

  await getOrCreate({ userId });

  return updateOne({ userId, ...data });
};
