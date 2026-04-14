import {
  deleteAccount,
  getUser,
  updateProfile,
} from "@workspace/core/use-cases/users";
import { updateProfileInputSchema } from "@workspace/types/use-cases/users";
import { authenticatedProcedure } from "../base";

const usersRouter = {
  getUser: authenticatedProcedure.handler(async ({ context }) => {
    return getUser(context.user.id);
  }),

  updateProfile: authenticatedProcedure
    .input(updateProfileInputSchema)
    .handler(async ({ context, input }) => {
      return updateProfile({ userId: context.user.id, name: input.name });
    }),

  deleteAccount: authenticatedProcedure.handler(async ({ context }) => {
    return deleteAccount({ userId: context.user.id });
  }),
};

export default usersRouter;
