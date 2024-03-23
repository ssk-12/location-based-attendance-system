import { Hono } from 'hono'
import { userRouter } from './routes/userRouter';
import { cors } from 'hono/cors'
import { eventsRouter } from './routes/eventRouter';

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();
app.use('/*', cors())
app.route('/api/v1/user', userRouter)
app.route('/api/v1/allevents' ,eventsRouter)

export default app
