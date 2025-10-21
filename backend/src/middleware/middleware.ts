import { Hono } from "hono";
import { verify } from "hono/jwt";

type JwtPayload = {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    DATABASE_URL_EDGE: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId?: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Missing Authorization header" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = (await verify(token, c.env.JWT_SECRET)) as JwtPayload | null;

    if (!user || !user.id) {
      return c.json({ message: "Invalid token" }, 401);
    }

    c.set("userId", user.id);
    await next();
  } catch (err) {
    console.error("[AUTH] token verify error", err);
    return c.json({ message: "Invalid or expired token" }, 401);
  }
});
