import { handleWebhook } from "@workspace/auth/webhook";
import {
  deleteOne,
  updateOne,
  upsertByClerkId,
} from "@workspace/repository/entities/users";
import type { UserJSON, WebhookEvent } from "@workspace/types/auth";

const getPrimaryEmail = (userData: UserJSON): string => {
  const primary = userData.email_addresses.find(
    (e) => e.id === userData.primary_email_address_id
  );

  if (!primary) {
    throw new Error("User has no primary email address");
  }

  return primary.email_address;
};

const getFullName = (userData: UserJSON): string | null => {
  const parts = [userData.first_name, userData.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
};

const createUserFromWebhook = async (userData: UserJSON) => {
  return await upsertByClerkId({
    clerkId: userData.id,
    email: getPrimaryEmail(userData),
    name: getFullName(userData),
    image: userData.image_url,
  });
};

const updateUserFromWebhook = async (userData: UserJSON) => {
  return await updateOne({
    clerkId: userData.id,
    name: getFullName(userData),
    image: userData.image_url,
  });
};

const deleteUserFromWebhook = async (userData: UserJSON) => {
  return await deleteOne({
    clerkId: userData.id,
  });
};

export const handleAuthWebhook = async (webhook: WebhookEvent) => {
  return await handleWebhook(
    webhook,
    createUserFromWebhook,
    updateUserFromWebhook,
    deleteUserFromWebhook
  );
};
