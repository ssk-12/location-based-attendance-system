import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";


export const eventsRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

eventsRouter.get('/events', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const eventsWithHosts = await prisma.event.findMany({
      include: {
        host: true, // Include host details
      },
    });
    return c.json(eventsWithHosts);
  });

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
        hostId: body.hostId, // Assuming the hostId is provided in the request body
      },
    });
    return c.json(newEvent);
  });

  // POST route to handle attendance update
eventsRouter.post('/attend', async (c) => {

  console.log("hello")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const body = await c.req.json();
  const { eventId, userEmail, status } = body;
  console.log(body)

  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
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
      eventId:eventId,
      userId: user.id,
      status: status,
    },
  });

  return c.json(attendance);
});
