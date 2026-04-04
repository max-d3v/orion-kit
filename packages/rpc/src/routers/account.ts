import {
  deleteAccount,
  updateProfile,
} from "@workspace/core/use-cases/account";
import { updateProfileInputSchema } from "@workspace/types/use-cases/account";
import { authenticatedProcedure } from "../base";

const accountRouter = {
  updateProfile: authenticatedProcedure
    .input(updateProfileInputSchema)
    .handler(async ({ context, input }) => {
      const { id } = context.user;
      return updateProfile({ userId: id, name: input.name });
    }),

  deleteAccount: authenticatedProcedure.handler(async ({ context }) => {
    const { id } = context.user;
    return deleteAccount({ userId: id });
  }),
};

export default accountRouter;
