// import type { SQL, SQLWrapper } from "@workspace/database/client";
// import { and, db, desc, eq, ilike, or } from "@workspace/database/client";
// import { organization } from "@workspace/database/schema";
// import { HttpError } from "@workspace/types/errors/http";
// import type {
//   CreateOrganizationParams,
//   DeleteOrganizationParams,
//   GetOrganizationParams,
//   JoinableParams,
//   ListOrganizationsParams,
//   OrganizationRawObject,
//   UpdateOrganizationParams,
//   WhereClauseParams,
// } from "@workspace/types/repository/organizations";

// const DEFAULT_PAGE_SIZE = 20;
// const DEFAULT_PAGE_NUM = 1;

// const buildSearchClause = (search?: string) => {
//   if (!search) {
//     return undefined;
//   }
//   return or(
//     ilike(organization.name, `%${search}%`),
//     ilike(organization.slug, `%${search}%`)
//   );
// };

// const buildWhere = (whereables: WhereClauseParams) => {
//   const { id, slug } = whereables;

//   const whereClause: SQLWrapper[] = [];
//   if (id) {
//     whereClause.push(eq(organization.id, id));
//   }
//   if (slug) {
//     whereClause.push(eq(organization.slug, slug));
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

//   if (include?.users) {
//     joinClause.users = true;
//   }
//   if (include?.members) {
//     joinClause.members = true;
//   }
//   if (include?.invitations) {
//     joinClause.invitations = true;
//   }

//   return joinClause;
// };

// export const list = async (params: ListOrganizationsParams) => {
//   const {
//     search,
//     pageNum = DEFAULT_PAGE_NUM,
//     pageSize = DEFAULT_PAGE_SIZE,
//     include,
//     ...rest
//   } = params;

//   const offset = (pageNum - 1) * pageSize;

//   const data = await db.query.organization.findMany({
//     where: buildWhereClause({ search, ...rest }),
//     orderBy: desc(organization.createdAt),
//     limit: pageSize,
//     offset,
//     with: buildJoinClause(include),
//   });

//   return data;
// };

// export const get = async (
//   params: GetOrganizationParams
// ): Promise<OrganizationRawObject> => {
//   const { id } = params;

//   const found = await db.query.organization.findFirst({
//     where: eq(organization.id, id),
//   });

//   if (!found) {
//     throw new HttpError(404, "Organization not found");
//   }

//   return found;
// };

// export const create = async (
//   params: CreateOrganizationParams
// ): Promise<OrganizationRawObject> => {
//   const result = await db.insert(organization).values(params).returning();

//   const created = result[0];
//   if (!created) {
//     throw new HttpError(500, "Failed to create organization");
//   }

//   return created;
// };

// export const updateOne = async (
//   params: UpdateOrganizationParams
// ): Promise<OrganizationRawObject> => {
//   const { id, ...data } = params;

//   const result = await db
//     .update(organization)
//     .set({ ...data, updatedAt: new Date() })
//     .where(eq(organization.id, id))
//     .returning();

//   const updated = result[0];
//   if (!updated) {
//     throw new HttpError(404, "Organization not found");
//   }

//   return updated;
// };

// export const deleteOne = async (
//   params: DeleteOrganizationParams
// ): Promise<OrganizationRawObject> => {
//   const { id } = params;

//   const result = await db
//     .delete(organization)
//     .where(eq(organization.id, id))
//     .returning();

//   const deleted = result[0];
//   if (!deleted) {
//     throw new HttpError(404, "Organization not found");
//   }

//   return deleted;
// };
