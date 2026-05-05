// import type { member } from "@workspace/database/schema";
// import type { ListBaseParams } from "./base";

// export type OrganizationMemberRawObject = typeof member.$inferSelect;

// export type CreateOrganizationMemberParams = typeof member.$inferInsert;

// export type UpdateOrganizationMemberParams = Partial<
//   typeof member.$inferInsert
// > & {
//   id: string;
// };

// export type WhereParams = {
//   id?: string;
//   userId?: string;
//   organizationId?: string;
// };

// export type JoinableParams = {
//   user: boolean;
//   organization: boolean;
// };

// export type GetOrganizationMemberParams = {
//   id: string;
// };

// export type DeleteOrganizationMemberParams = {
//   id: string;
// };

// export type WhereClauseParams = WhereParams & {
//   search?: string;
// };

// export type ListOrganizationMembersParams = ListBaseParams &
//   WhereParams & {
//     include?: JoinableParams;
//   };

// export type FindOrganizationMembersParams = WhereParams & {
//   include?: JoinableParams;
// };
