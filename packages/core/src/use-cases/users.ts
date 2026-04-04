import { usersRepository } from "@workspace/repository";
import type { UserRawObject } from "@workspace/types/repository/users";

export const getUser = async (userId: string): Promise<UserRawObject> => {
  return await usersRepository.get({ id: userId });
};
