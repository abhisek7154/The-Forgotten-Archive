import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign , verify} from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    DATABASE_URL_EDGE: string,
    JWT_SECRET: string
  }
}>()

app.post('/api/v1/user/signup' , async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL_EDGE,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
  
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
  
    return c.json({
      jwt: token
    })
})

app.post('/api/v1/user/signin' , async (c) => {
    const prisma = new PrismaClient({
    //@ts-ignore
        datasourceUrl: c.env?.DATABASE_URL_EDGE,
    }).$extends(withAccelerate());

    const body = await c.req.json();
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


app.post('/api/v1/blog' , (c) => {
  return c.text('This is a Blog post route')
})

app.put('/api/v1/blog' , (c) => {
  return c.text('This is a Blog put route')
})

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.get('/api/v1/blog/bulk', (c) =>{
  return c.text('Multiple blogs fetched')
})
export default app
 