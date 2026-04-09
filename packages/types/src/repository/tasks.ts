import {
  createInsertSchema,
  createUpdateSchema,
} from "@workspace/database/drizzle-zod";
import { tasks } from "@workspace/database/schema";
import { z } from "zod";
import { listBaseParamsSchema } from "./base";

export const searchables = ["title", "description", "status"];

export const createTaskInputSchema = createInsertSchema(tasks);
export const updateTaskInputSchema = createUpdateSchema(tasks).extend({
  id: z.string().uuid(),
});
export const getTaskInputSchema = z.object({
  id: z.string(),
});
export const listTasksParamsSchema = listBaseParamsSchema.extend({
  userId: z.string(),
});
export const deleteTaskParamsSchema = z.object({
  id: z.string(),
});

export type TaskRawObject = typeof tasks.$inferSelect;

export type CreateTaskParams = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskParams = z.infer<typeof updateTaskInputSchema>;
export type GetTaskParams = z.infer<typeof getTaskInputSchema>;
export type ListTasksParams = z.infer<typeof listTasksParamsSchema>;
export type DeleteTaskParams = z.infer<typeof deleteTaskParamsSchema>;
