import { Axiom } from "@axiomhq/js";
import { env } from "./keys";

const axiomClient = new Axiom({
  token: env.NEXT_PUBLIC_AXIOM_TOKEN,
});

export default axiomClient;
