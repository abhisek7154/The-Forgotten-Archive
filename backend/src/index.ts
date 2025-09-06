import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/extension'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign , verify} from 'hono/jwt'
import bcrypt from 'bcryptjs'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup' , async (c) => {
try{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json();
  const hashedPassword  = await bcrypt.hash(body.password , 10)

  const user =await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword
    }
  });

  // JWT payload with expary

  const payload = {
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 , // 1 hour
  }

  const jwt = await sign(payload , c.env.JWT_SECRET);
  return c.json({jwt})

} catch(e){
  c.status(403);
  return c.json({ error: "error while signing up" });
}

})

app.post('/api/v1/user/signin' , (c) => {
  return c.text('This is signin route')
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
 