// import type { organization } from "@workspace/database/schema";
// import type { ListBaseParams } from "./base";

// export type OrganizationRawObject = typeof organization.$inferSelect;

// export type CreateOrganizationParams = typeof organization.$inferInsert;

// export type UpdateOrganizationParams = Partial<typeof organization.$inferInsert> & {
//   id: string;
// };

// export type WhereParams = {
//   id?: string;
//   slug?: string;
// };

// export type JoinableParams = {
//   users: boolean;
//   members: boolean;
//   invitations: boolean;
// };

// export type GetOrganizationParams = {
//   id: string;
// };

// export type DeleteOrganizationParams = {
//   id: string;
// };

// export type WhereClauseParams = WhereParams & {
//   search?: string;
// };

// export type ListOrganizationsParams = ListBaseParams &
//   WhereParams & {
//     include?: JoinableParams;
//   };
