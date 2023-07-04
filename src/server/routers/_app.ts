/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc"
import { credentialsRouter } from "./credentials"
import { postsRouter } from "./posts"
import { usersRouter } from "./users"

export const appRouter = router({
    session: publicProcedure.query(({ ctx }) => {
        return ctx.user ?? null
    }),
    users: usersRouter,
    credentials: credentialsRouter,
    posts: postsRouter,
})

export type AppRouter = typeof appRouter
