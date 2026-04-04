import { usersRepository } from "@workspace/repository";

export const updateProfile = async (params: {
  userId: string;
  name: string;
}) => {
  const { userId, name } = params;

  const user = await usersRepository.updateOne({ id: userId, name });

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    image: user.image ?? undefined,
    emailVerified: user.emailVerified ?? undefined,
  };
};

export const deleteAccount = async (params: { userId: string }) => {
  const { userId } = params;
  await usersRepository.deleteOne({ id: userId });
  return { deleted: true };
};
