import * as userPreferencesRepository from "@workspace/repository/entities/user-preferences";
import type { UpdatePreferencesInput } from "@workspace/types/repository/user-preferences";

export const getOrCreatePreferences = async (params: { userId: string }) => {
  const { userId } = params;
  return userPreferencesRepository.getOrCreate({ userId });
};

export const updatePreferences = async (params: {
  userId: string;
  data: UpdatePreferencesInput;
}) => {
  const { userId, data } = params;

  await userPreferencesRepository.getOrCreate({ userId });

  return userPreferencesRepository.updateOne({ userId, ...data });
};
