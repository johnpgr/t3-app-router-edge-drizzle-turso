/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc"
import { usersRouter } from "./users"

export const appRouter = router({
    whoami: publicProcedure.query(({ ctx }) => {
        return ctx.user ?? null
    }),
    users: usersRouter,
})

export type AppRouter = typeof appRouter
