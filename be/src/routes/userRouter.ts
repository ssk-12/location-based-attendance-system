import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import {signupInput, signinInput} from "@ssk2003/common";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, Variables: {
		userId: string;
	}
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success){
        return c.json({message:"incorrect inputs"})
    }

    try {
        const user = await prisma.user.create({
            data: {
                name : body.name,
                email: body.email,
                password: body.password,
            },
        });

        const token = await sign({ id: user.id }, c.env.JWT_SECRET)

        return c.json({
            jwt: token
        })
    } catch (error) {
        return c.json({
            message: "User already exsists"
        })
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if(!success){
        return c.json({message:"incorrect inputs"})
    }
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


userRouter.use('/users/', async (c, next) => {
    try {
        
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const jwt = c.req.header('Authorization');
        if (!jwt) {
            c.status(401);
            return c.json({ error: "Unauthorized: No token provided." });
        }
        
        const token = jwt.split(' ')[1];
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


userRouter.get('/usersdetails', async (c) => {

    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.get('userId');
    
    const user = await prisma.user.findUnique({
      where: {id},
      include: { events: true, attendances: true }, // Adjust based on what details you need
    });
  
    if (user) {
      return c.json(user);
    } else {
      return c.json({ message: 'User not found' }, 404);
    }
  });

