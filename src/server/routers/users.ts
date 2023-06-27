import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "~/db/drizzle-db";
import { hashUtils } from "~/utils/hash"

export const usersRouter = router({
    validateCredentials: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string(),
    })).query(async ({ input }) => {
        const user = await db.query.users.findFirst({
            columns: {},
            with: {
                password: {
                    columns: {
                        salt: true, hashedPassword: true,
                    }
                }
            },
            where: (user, { eq }) => eq(user.email, input.email)
        })

        if (!user || !user.password) return false 

        const { salt, hashedPassword } = user.password

        const isValidPassword = await hashUtils.comparePasswords(input.password, hashedPassword, salt)

        return isValidPassword
    }),

    getByEmail: publicProcedure.input(z.object({
        email: z.string(),
    })).query(async ({ input }) => {
        const user = await db.query.users.findFirst({
            columns: {
                id: true,
                email: true,
                name: true,
                image: true,
            },
            where: (user, { eq }) => eq(user.email, input.email)
        })

        return user
    })
})
