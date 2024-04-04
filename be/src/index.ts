import { Hono } from 'hono'
import { userRouter } from './routes/userRouter';
import { cors } from 'hono/cors'
import { eventsRouter } from './routes/eventRouter';
import { classRouter } from './routes/classRouter';

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();
app.use('/*', cors())
app.route('/api/v1/user', userRouter)
app.route('/api/v1/allevents' ,eventsRouter)
app.route('/api/v1/class' ,classRouter)

export default app
