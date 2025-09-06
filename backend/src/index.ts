import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/extension'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup' , (c) => {
  const prisma = new PrismaClient({
    DatasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text('This is signup route')

  
})

app.post('/api/v1/user/signin' , (c) => {
  return c.text('This is signin route')
})

app.post('/api/v1/blog' , (c) => {
  return c.text('This is a Blog post route')
})

app.put('/api/v1/blog' , (c) => {
  return c.text('Thsi is a Blog put route')
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
 