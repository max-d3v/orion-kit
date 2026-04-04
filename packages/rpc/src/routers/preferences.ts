import {
  getOrCreatePreferences,
  updatePreferences,
} from "@workspace/core/use-cases/preferences";
import { updatePreferencesInputSchema } from "@workspace/types/use-cases/preferences";
import { authenticatedProcedure } from "../base";

const preferencesRouter = {
  get: authenticatedProcedure.handler(async ({ context }) => {
    const { id } = context.user;
    return getOrCreatePreferences({ userId: id });
  }),

  update: authenticatedProcedure
    .input(updatePreferencesInputSchema)
    .handler(async ({ context, input }) => {
      const { id } = context.user;
      return updatePreferences({ userId: id, data: input });
    }),
};

export default preferencesRouter;
