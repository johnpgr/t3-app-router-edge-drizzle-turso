import { z } from "zod"
import { publicProcedure, privateProcedure, router } from "../trpc"
import { db } from "~/drizzle"
import { createUlid } from "~/src/utils/ulid"
import { users } from "~/drizzle/schema"
import { hashUtils } from "~/auth/hash-utils"
import { updateUserInputSchema } from "~/src/utils/schemas"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

export const usersRouter = router({
    get: publicProcedure
        .input(
            z.object({
                email: z.string().optional(),
                id: z.string().optional(),
            }),
        )
        .query(async ({ input }) => {
            const { email, id } = input
            if (!email && !id)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "email or id is required",
                })

            if(email){
                const user = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.email, email),
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                })
                return user
            }
            
            if(id){
                const user = await db.query.users.findFirst({
                    where: (user, { eq }) => eq(user.id, id),
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                })
                return user
            }
        }),

    create: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
                username: z.string(),
                image: z.string().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, password, username, image } = input

            const foundEmail = await db.query.users.findFirst({
                where: (user, { eq }) => eq(user.email, email),
                columns: {
                    email: true,
                },
            })

            if (foundEmail) throw new Error("Email already in use")

            const foundUsername = await db.query.users.findFirst({
                where: (user, { eq }) => eq(user.name, username),
                columns: {
                    name: true,
                },
            })

            if (foundUsername) throw new Error("Username already in use")

            const createdUser = await db
                .insert(users)
                .values({
                    id: createUlid(),
                    email,
                    hashedPassword: await hashUtils.hashPassword(password),
                    image,
                    name: username,
                })
                .returning({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    image: users.image,
                })
                .get()

            return createdUser
        }),

    update: privateProcedure
        .input(updateUserInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { username, email, password, image } = input

            const updatedUser = await db
                .update(users)
                .set({
                    email,
                    name: username,
                    hashedPassword: password
                        ? await hashUtils.hashPassword(password)
                        : null,
                    image: image ?? null,
                })
                .where(eq(users.id, ctx.user.id))
                .returning({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    image: users.image,
                })
                .get()

            return updatedUser
        }),
})
