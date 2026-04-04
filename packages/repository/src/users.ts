import {
  and,
  count,
  db,
  desc,
  eq,
  ilike,
  or,
  users,
} from "@workspace/database";
import { HttpError } from "@workspace/types/errors/http";
import type {
  CreateUserParams,
  DeleteUserParams,
  GetUserByEmailParams,
  GetUserParams,
  ListUsersParams,
  UpdateUserParams,
  UserRawObject,
} from "@workspace/types/repository/users";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUM = 1;

type UsersFindManyConfig = NonNullable<
  Parameters<typeof db.query.users.findMany>[0]
>;

const buildSearchClause = (search?: string) => {
  if (!search) {
    return undefined;
  }
  return or(
    ilike(users.name, `%${search}%`),
    ilike(users.email, `%${search}%`)
  );
};

export const list = async (
  params: ListUsersParams & { with?: UsersFindManyConfig["with"] }
) => {
  const {
    search,
    pageNum = DEFAULT_PAGE_NUM,
    pageSize = DEFAULT_PAGE_SIZE,
    with: withConfig,
  } = params;

  const searchClause = buildSearchClause(search);
  const whereClause = searchClause ? and(searchClause) : undefined;
  const offset = (pageNum - 1) * pageSize;

  const [data, totalResult] = await Promise.all([
    db.query.users.findMany({
      where: whereClause,
      orderBy: desc(users.createdAt),
      limit: pageSize,
      offset,
      with: withConfig,
    }),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
};

export const get = async (params: GetUserParams): Promise<UserRawObject> => {
  const { id } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const getByEmail = async (
  params: GetUserByEmailParams
): Promise<UserRawObject> => {
  const { email } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const create = async (
  params: CreateUserParams
): Promise<UserRawObject> => {
  const result = await db.insert(users).values(params).returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(500, "Failed to create user");
  }

  return user;
};

export const updateOne = async (
  params: UpdateUserParams
): Promise<UserRawObject> => {
  const { id, ...data } = params;

  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const deleteOne = async (
  params: DeleteUserParams
): Promise<UserRawObject> => {
  const { id } = params;

  const result = await db.delete(users).where(eq(users.id, id)).returning();

  const user = result[0];
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};
