import { z } from "zod";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
};

export const updateProfileInputSchema = z.object({
  name: z.string().min(1),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export type UpdateProfileResponse = AuthUser;

export type DeleteAccountResponse = { deleted: boolean };
