import { organizationRole } from "@workspace/database/schema";
import { z } from "zod";

export const organizationRoleSchema = z.enum(organizationRole.enumValues);
export type OrganizationRole = z.infer<typeof organizationRoleSchema>;
