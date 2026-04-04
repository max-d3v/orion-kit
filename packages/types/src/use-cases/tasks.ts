import { z } from "zod";

//export const getUserTasksInputSchema =

export const getUserTasksInputSchema = z.object({
  userId: z.string().uuid(),
});

export type GetUserTasksInput = z.infer<typeof getUserTasksInputSchema>;
