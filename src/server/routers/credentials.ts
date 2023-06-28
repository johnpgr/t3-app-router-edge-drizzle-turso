import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { db } from "~/drizzle"
import { hashUtils } from "~/auth/hash-utils"

export const credentialsRouter = router({
    validate: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const user = await db.query.users.findFirst({
                columns: {
                    hashedPassword: true,
                },
                where: (user, { eq }) => eq(user.email, input.email),
            })

            if (!user || !user.hashedPassword) return false

            const isValidPassword = await hashUtils.comparePasswords(
                input.password,
                user.hashedPassword,
            )

            return isValidPassword
        }),
})
