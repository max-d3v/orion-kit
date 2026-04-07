import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@workspace/rpc";
import { headers } from "next/headers";

const handler = new RPCHandler(router);

const handleRequest = async (request: Request) => {
  const { matched, response } = await handler.handle(request, {
    prefix: "/rpc",
  });

  if (matched) {
    return response;
  }

  return new Response("Not found", { status: 404 });
};

export const GET = handleRequest;
export const POST = handleRequest;
