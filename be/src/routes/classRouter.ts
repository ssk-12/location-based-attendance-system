import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";


export const classRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, Variables: {
        userId: string;
    }
}>();

classRouter.use('/*', async (c, next) => {
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

//route to fetch user enrolled classes
classRouter.get('/classes', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");

    try {
        // Fetch enrolled classes for the user
        const enrolledClasses = await prisma.classEnrollment.findMany({
            where: {
                userId: userId,
            },
            include: {
                class: {
                    include: {
                        host: true, // Include the host relation here
                    },
                },
            },
        })

        // Modify the return to include the host's name
        return c.json(enrolledClasses.map(enrollment => ({
            ...enrollment.class
        })));
    } catch (error) {
        console.error("Failed to fetch enrolled classes:", error)
        return c.json({ error: "Failed to fetch enrolled classes" }, 500)
    }
});

// classRouter.get('/classes', async (c) => {

//     const prisma = new PrismaClient({
//         datasourceUrl: c.env?.DATABASE_URL,
//     }).$extends(withAccelerate());

//     const userId = c.get("userId");

//     try {
//         // Fetch enrolled classes for the user
//         const enrolledClasses = await prisma.classEnrollment.findMany({
//             where: {
//                 userId: userId,
//             },
//             include: {
//                 class: true,
//             },
//         })

//         return c.json(enrolledClasses.map(enrollment => enrollment.class))
//     } catch (error) {
//         console.error("Failed to fetch enrolled classes:", error)
//         return c.json({ error: "Failed to fetch enrolled classes" }, 500)
//     }
// })

classRouter.post('/classes', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const { name, subject} = await c.req.json()
    
    try {
        // Create the class
        const newClass = await prisma.class.create({
            data: {
                name,
                subject,
                hostId: c.get("userId"), // Assuming this field links the class to its creator
            },
        });

        // Automatically enroll the creator in the class
        await prisma.classEnrollment.create({
            data: {
                classId: newClass.id,
                userId: c.get("userId"),
            },
        });

        // Return the created class
        return c.json(newClass);
    } catch (error) {
        // Handle potential errors, such as missing fields or database issues
        console.error('Failed to create class:', error);
        return c.json({ error: 'Failed to create class' }, 500);
    }
});


// classRouter.post('/classes', async (c) => {

//     const prisma = new PrismaClient({
//         datasourceUrl: c.env?.DATABASE_URL,
//     }).$extends(withAccelerate());

//     const { name, subject} = await c.req.json()
    

//     try {
        
//         const newClass = await prisma.class.create({
//             data: {
//                 name,
//                 subject,
//                 hostId: c.get("userId"),
//             },
//         })

//         // Return the created class
//         return c.json(newClass)
//     } catch (error) {
//         // Handle potential errors, such as missing fields or database issues
//         console.error('Failed to create class:', error)
//         return c.json({ error: 'Failed to create class' }, 500)
//     }
// })

classRouter.post('/enroll', async (c) => {
    // Extract classId and userId from the request body
    const { classId } = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      // Use Prisma Client to create a new class enrollment
      const newEnrollment = await prisma.classEnrollment.create({
        data: {
          classId,
          userId:c.get("userId"),
        },
      });
  
      // Return the created enrollment
      return c.json(newEnrollment);
    } catch (error) {
      // Handle potential errors, such as duplicate enrollment or database issues
      console.error('Failed to enroll in class:', error);
      return c.json({ error: 'Failed to enroll in class' }, 500);
    }
  });


  // Route to get all users enrolled in a specific class
classRouter.get('/class/:classId/enrollments', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const classId = c.req.param('classId')
  
    const enrollments = await prisma.classEnrollment.findMany({
      where: { classId: classId },
      include: {
        user: true, // Include user details
      },
    })
  
    const users = enrollments.map(enrollment => ({
      userId: enrollment.userId,
      name: enrollment.user.name,
      email: enrollment.user.email,
    }))
  
    return c.json(users)
  })

  // Bulk mark attendance for users in a specific class
classRouter.post('/class/:classId/attendance/bulk', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const classId = c.req.param('classId')
    const { userIds, status } = await c.req.json() // Expecting an array of user IDs and a status
  
    try {
      // Transaction ensures that all updates are processed as a single operation
      const transaction = userIds.map((userId:any) => 
        prisma.classAttendance.upsert({
          where: { uniqueClassUserAttendance: { classId, userId } },
          update: { status },
          create: { classId, userId, status },
        })
      )
  
      // Execute the transaction
      await prisma.$transaction(transaction)
  
      return c.json({ message: 'Attendance marked successfully' })
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      return c.json({ error: 'Failed to mark attendance' }, 500)
    }
  })
  