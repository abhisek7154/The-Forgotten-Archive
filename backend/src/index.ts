import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './middleware/middleware';
import { cors } from 'hono/cors'
import { userRouterV2 } from './v2/routes/user';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    DATABASE_URL_EDGE: string,
    JWT_SECRET: string
  }
}>();

const appv2 = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    DATABASE_URL_EDGE: string,
    JWT_SECRET: string
  }
}>();

app.use('/*' , cors())
app.route('/api/v1/user' , userRouter)
app.route('/api/v1/blog' , blogRouter)
appv2.route('/api/v2/user' ,userRouterV2 )

export default app
 