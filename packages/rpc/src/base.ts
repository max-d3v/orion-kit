import { os } from "@orpc/server";
import { errors } from "./errors";
export const base = os.errors(errors).$context<{ headers: Headers }>();
