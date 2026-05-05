// import type { invitation } from "@workspace/database/schema";
// import type { ListBaseParams } from "./base";

// export type OrganizationInvitationRawObject = typeof invitation.$inferSelect;

// export type CreateOrganizationInvitationParams =
//   typeof invitation.$inferInsert;

// export type UpdateOrganizationInvitationParams = Partial<
//   typeof invitation.$inferInsert
// > & {
//   id: string;
// };

// export type WhereParams = {
//   id?: string;
//   organizationId?: string;
//   email?: string;
// };

// export type JoinableParams = {
//   organization: boolean;
// };

// export type GetOrganizationInvitationParams = {
//   id: string;
// };

// export type DeleteOrganizationInvitationParams = {
//   id: string;
// };

// export type WhereClauseParams = WhereParams & {
//   search?: string;
// };

// export type ListOrganizationInvitationsParams = ListBaseParams &
//   WhereParams & {
//     include?: JoinableParams;
//   };
