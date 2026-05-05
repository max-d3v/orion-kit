// import type { SQL, SQLWrapper } from "@workspace/database/client";
// import { and, db, desc, eq } from "@workspace/database/client";
// import { member } from "@workspace/database/schema";
// import { HttpError } from "@workspace/types/errors/http";
// import type {
//   CreateOrganizationMemberParams,
//   DeleteOrganizationMemberParams,
//   FindOrganizationMembersParams,
//   GetOrganizationMemberParams,
//   JoinableParams,
//   ListOrganizationMembersParams,
//   OrganizationMemberRawObject,
//   UpdateOrganizationMemberParams,
//   WhereClauseParams,
// } from "@workspace/types/repository/organization-members";

// const DEFAULT_PAGE_SIZE = 20;
// const DEFAULT_PAGE_NUM = 1;

// const buildSearchClause = (_search?: string) => {
//   // No searchable text fields on organization members
//   return undefined;
// };

// const buildWhere = (whereables: WhereClauseParams) => {
//   const { id, userId, organizationId } = whereables;

//   const whereClause: SQLWrapper[] = [];
//   if (id) {
//     whereClause.push(eq(member.id, id));
//   }
//   if (userId) {
//     whereClause.push(eq(member.userId, userId));
//   }
//   if (organizationId) {
//     whereClause.push(eq(member.organizationId, organizationId));
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

//   if (include?.user) {
//     joinClause.user = true;
//   }
//   if (include?.organization) {
//     joinClause.organization = true;
//   }

//   return joinClause;
// };

// export const list = async (params: ListOrganizationMembersParams) => {
//   const {
//     search,
//     pageNum = DEFAULT_PAGE_NUM,
//     pageSize = DEFAULT_PAGE_SIZE,
//     include,
//     ...rest
//   } = params;

//   const offset = (pageNum - 1) * pageSize;

//   const data = await db.query.member.findMany({
//     where: buildWhereClause({ search, ...rest }),
//     orderBy: desc(member.createdAt),
//     limit: pageSize,
//     offset,
//     with: buildJoinClause(include),
//   });

//   return data;
// };

// export const get = async (
//   params: GetOrganizationMemberParams
// ): Promise<OrganizationMemberRawObject> => {
//   const { id } = params;

//   const found = await db.query.member.findFirst({
//     where: eq(member.id, id),
//   });

//   if (!found) {
//     throw new HttpError(404, "Organization member not found");
//   }

//   return found;
// };

// export const find = async (
//   params: FindOrganizationMembersParams
// ): Promise<OrganizationMemberRawObject[]> => {
//   const { include, ...rest } = params;

//   return await db.query.member.findMany({
//     where: buildWhereClause(rest),
//     with: buildJoinClause(include),
//   });
// };

// export const create = async (
//   params: CreateOrganizationMemberParams
// ): Promise<OrganizationMemberRawObject> => {
//   const result = await db.insert(member).values(params).returning();

//   const created = result[0];
//   if (!created) {
//     throw new HttpError(500, "Failed to create organization member");
//   }

//   return created;
// };

// export const updateOne = async (
//   params: UpdateOrganizationMemberParams
// ): Promise<OrganizationMemberRawObject> => {
//   const { id, ...data } = params;

//   const result = await db
//     .update(member)
//     .set({ ...data, updatedAt: new Date() })
//     .where(eq(member.id, id))
//     .returning();

//   const updated = result[0];
//   if (!updated) {
//     throw new HttpError(404, "Organization member not found");
//   }

//   return updated;
// };

// export const deleteOne = async (
//   params: DeleteOrganizationMemberParams
// ): Promise<OrganizationMemberRawObject> => {
//   const { id } = params;

//   const result = await db
//     .delete(member)
//     .where(eq(member.id, id))
//     .returning();

//   const deleted = result[0];
//   if (!deleted) {
//     throw new HttpError(404, "Organization member not found");
//   }

//   return deleted;
// };
