import { z } from "zod";

export const errors = {
  UNAUTHORIZED: {
    data: z.object({}),
  },
  EXPECTED_ERROR_DEMO: {
    data: z.object({}),
  },
};
