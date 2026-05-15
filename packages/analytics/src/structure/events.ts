export const EVENTS = {
  user_created: "user_created",
  user_pageview: "user_pageview",
  task_created: "task_created",
  task_completed: "task_completed",
  expected_error: "expected_error",
} as const;

export type Event = (typeof EVENTS)[keyof typeof EVENTS];
