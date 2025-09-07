import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
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

// small helper to create Prisma client using the edge DATABASE URL for this request.
// On edge runtimes it's common to create per-request, but you can implement caching
// if you know your environment allows long-lived globals.
function getPrisma(c: any) {
  return new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
}

/**
 * Auth middleware: extracts `Bearer <token>` and sets `userId` in context Variables.
 */

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

/**
 * Create a post (authenticated)
 */


blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  if (!body || !body.title || !body.content) {
    return c.json({ error: "Missing title or content" }, 400);
  }

  const prisma = getPrisma(c);

  const post = await prisma.post.create({
    data: {
      title: String(body.title),
      content: String(body.content),
      authorId: userId,
    },
  });

  return c.json({ id: post.id }, 201);
});

/**
 * Update a post: only the author can update.
 */


blogRouter.put("/", async (c) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  const { id, title, content } = body || {};

  if (!id) return c.json({ error: "Missing post id" }, 400);
  if (!title && !content) return c.json({ error: "Nothing to update" }, 400);

  const prisma = getPrisma(c);

  // ensure the post exists and belongs to this user
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Post not found" }, 404);
  if (existing.authorId !== userId) return c.json({ error: "Forbidden" }, 403);

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(title ? { title: String(title) } : {}),
      ...(content ? { content: String(content) } : {}),
    },
  });

  return c.json({ id: updated.id });
});

/**
 * Get single post by query param ?id=...
 */

blogRouter.get("/", async (c) => {
  const id = c.req.query("id");
  if (!id) return c.json({ error: "Missing id query param" }, 400);

  const prisma = getPrisma(c);

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return c.json({ error: "Not found" }, 404);
    return c.json({ post });
  } catch (e) {
    console.error("[GET POST] error", e);
    return c.json({ message: "Error while fetching blog post" }, 500);
  }
});

/**
 * Bulk posts (public or protected as you like)
 */
blogRouter.get("/bulk", async (c) => {
  const prisma = getPrisma(c);
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } }); // if you have createdAt
  return c.json({ posts });
});
