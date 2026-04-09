import { z } from "zod";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean | null;
};
export type AuthResponse = AuthUser;
export type LoginInput = { email: string; password: string };
export type LoginResponse = AuthUser;
export type RegisterInput = { email: string; password: string; name: string };
export type RegisterResponse = AuthUser;
export type LogoutResponse = null;
export type UpdateProfileResponse = unknown;
export type DeleteAccountResponse = { deleted: boolean };

export const updateProfileInputSchema = z.object({
  name: z.string().min(1),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
