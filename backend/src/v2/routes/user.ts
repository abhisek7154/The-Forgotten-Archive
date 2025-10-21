import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from 'hono/jwt';
import { SignupInput , SigninInput } from "abhi-medium-blog";
import bcrypt from "bcryptjs";
import { Extends } from '../../generated/prisma/index';

export const userRouterV2 = new Hono <{
Bindings: {
    DATABASE_URL: string,
    DATABASE_URL_EDGE: string,
    JWT_SECRET: string
  }
}>()

userRouterV2.post('/signup' , async(c) => {
    const body = await c.req.json()

    const {success} = SignupInput.safeParse(body)

    if(!success){
        c.status(411);
        return c.json({
            messgae:"Inputes are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const salt = 12;
    const hashedPassword = await bcrypt.hash(body.password, salt )

    const user = await prisma.user.create({
        data:{
            email: body.email,
            password: hashedPassword,
            name: body.name
        },
    });

    const payLoad = {
        id: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 12 // 12 days expire
    }
    const token = await sign ( payLoad , c.env.JWT_SECRET)

    return c.json({
        jwt: token,
        email: user.email,
        name: user.name
    })
    
})

userRouterV2.post('/signin' , async(c) => {
   const body = await c.req.json();
   const {success} = SigninInput.safeParse(body)

   if(!success){
    c.status(411);
    return c.json({
        message: "Inputes not correct"
    })
   }
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
   }.$extends(withAccelerate()))
})