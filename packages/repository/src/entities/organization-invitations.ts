// import type { SQL, SQLWrapper } from "@workspace/database/client";
// import { and, db, desc, eq, ilike } from "@workspace/database/client";
// import { invitation } from "@workspace/database/schema";
// import { HttpError } from "@workspace/types/errors/http";
// import type {
//   CreateOrganizationInvitationParams,
//   DeleteOrganizationInvitationParams,
//   GetOrganizationInvitationParams,
//   JoinableParams,
//   ListOrganizationInvitationsParams,
//   OrganizationInvitationRawObject,
//   UpdateOrganizationInvitationParams,
//   WhereClauseParams,
// } from "@workspace/types/repository/organization-invitations";

// const DEFAULT_PAGE_SIZE = 20;
// const DEFAULT_PAGE_NUM = 1;

// const buildSearchClause = (search?: string) => {
//   if (!search) {
//     return undefined;
//   }
//   return ilike(invitation.email, `%${search}%`);
// };

// const buildWhere = (whereables: WhereClauseParams) => {
//   const { id, organizationId, email } = whereables;

//   const whereClause: SQLWrapper[] = [];
//   if (id) {
//     whereClause.push(eq(invitation.id, id));
//   }
//   if (organizationId) {
//     whereClause.push(eq(invitation.organizationId, organizationId));
//   }
//   if (email) {
//     whereClause.push(eq(invitation.email, email));
//   }

//   return and(...whereClause);
// };

// const buildWhereClause = (params: WhereClauseParams): SQL | undefined => {
//   const { search, ...data } = params;
//   const searchClause = buildSearchClause(search);
//   const where = buildWhere(data);

//   const whereClause: SQLWrapper[] = [];
//   if (searchClause) {
//     whereClause.push(searchClause);
//   }
//   if (where) {
//     whereClause.push(where);
//   }

//   return and(...whereClause);
// };

// const buildJoinClause = (include: JoinableParams | undefined) => {
//   const joinClause: Record<string, boolean> = {};

//   if (include?.organization) {
//     joinClause.organization = true;
//   }

//   return joinClause;
// };

// export const list = async (params: ListOrganizationInvitationsParams) => {
//   const {
//     search,
//     pageNum = DEFAULT_PAGE_NUM,
//     pageSize = DEFAULT_PAGE_SIZE,
//     include,
//     ...rest
//   } = params;

//   const offset = (pageNum - 1) * pageSize;

//   const data = await db.query.invitation.findMany({
//     where: buildWhereClause({ search, ...rest }),
//     orderBy: desc(invitation.createdAt),
//     limit: pageSize,
//     offset,
//     with: buildJoinClause(include),
//   });

//   return data;
// };

// export const get = async (
//   params: GetOrganizationInvitationParams
// ): Promise<OrganizationInvitationRawObject> => {
//   const { id } = params;

//   const found = await db.query.invitation.findFirst({
//     where: eq(invitation.id, id),
//   });

//   if (!found) {
//     throw new HttpError(404, "Organization invitation not found");
//   }

//   return found;
// };

// export const create = async (
//   params: CreateOrganizationInvitationParams
// ): Promise<OrganizationInvitationRawObject> => {
//   const result = await db.insert(invitation).values(params).returning();

//   const created = result[0];
//   if (!created) {
//     throw new HttpError(500, "Failed to create organization invitation");
//   }

//   return created;
// };

// export const updateOne = async (
//   params: UpdateOrganizationInvitationParams
// ): Promise<OrganizationInvitationRawObject> => {
//   const { id, ...data } = params;

//   const result = await db
//     .update(invitation)
//     .set({ ...data, updatedAt: new Date() })
//     .where(eq(invitation.id, id))
//     .returning();

//   const updated = result[0];
//   if (!updated) {
//     throw new HttpError(404, "Organization invitation not found");
//   }

//   return updated;
// };

// export const deleteOne = async (
//   params: DeleteOrganizationInvitationParams
// ): Promise<OrganizationInvitationRawObject> => {
//   const { id } = params;

//   const result = await db
//     .delete(invitation)
//     .where(eq(invitation.id, id))
//     .returning();

//   const deleted = result[0];
//   if (!deleted) {
//     throw new HttpError(404, "Organization invitation not found");
//   }

//   return deleted;
// };
