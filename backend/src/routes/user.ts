import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import {SignupInput , SigninInput} from 'abhi-medium-blog'

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    DATABASE_URL_EDGE: string,
    JWT_SECRET: string
  }
}>()

userRouter.post('/signup' , async (c) => {
    const body = await c.req.json();

    const {success} = SignupInput.safeParse(body);

    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name
      },
    });
  
    const token = await sign({ id: user.id , email: user.email }, c.env.JWT_SECRET)
  
    return c.json({
      jwt: token,
      email: user.email,
      name: user.name,
    })
})

userRouter.post('/signin' , async (c) => {
    const body = await c.req.json();
    const {success} = SigninInput.safeParse(body);

    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    });

    if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
})
