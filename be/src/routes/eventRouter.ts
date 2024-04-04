import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";


export const eventsRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }, Variables: {
    userId: string;
  }
}>();


//middleware for checking authetication
eventsRouter.use('/*', async (c, next) => {
  try {

    console.log("event middeleware")

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const jwt = c.req.header('Authorization');
    if (!jwt) {
      c.status(401);
      return c.json({ error: "Unauthorized: No token provided." });
    }

    const token = jwt.split(' ')[1];
    console.log("token:", token)
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token." });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found." });
    }

    c.set('userId', user.id);
    await next();
  } catch (error) {

    console.error('Authentication error:', error);


    c.status(500);
    return c.json({ error: "An internal server error occurred." });
  }
});

//route fetch all the events along with host
eventsRouter.get('/events', async (c) => {
  console.log("events")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const eventsWithHosts = await prisma.event.findMany({
    include: {
      host: true,
    },
  });
  return c.json(eventsWithHosts);
});

//route to handle the creation of event
eventsRouter.post('/event/create', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const newEvent = await prisma.event.create({
    data: {
      name: body.name,
      location: body.location,
      proximity: parseFloat(body.proximity),
      timestamp: new Date(body.timestamp),
      hostId: c.get("userId"),
    },
  });
  return c.json(newEvent);
});

// POST route to handle attendance update
eventsRouter.post('/attend', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { eventId, status } = body;
  const userId = c.get("userId")
  const user = await prisma.user.findUnique({
    where: {
      // email: userEmail,
      id: userId
    },
  });

  if (!user) {
    return c.json({ message: 'User not found.' }, 404);
  }

  // Upsert attendance record
  const attendance = await prisma.attendance.upsert({
    where: {
      uniqueEventUser: {
        eventId: eventId,
        userId: user.id,
      },
    },
    update: {
      status: status,
    },
    create: {
      eventId: eventId,
      userId: user.id,
      status: status,
    },
  });

  return c.json(attendance);
});
