import { authMiddleware } from "@workspace/auth/proxy";

export default authMiddleware();

export const config = {
  matcher: ["/rpc/:path*"],
};
