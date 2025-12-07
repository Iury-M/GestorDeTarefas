export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/:path*", "/workspaces/:path*", "/api/tasks/:path*"] };
