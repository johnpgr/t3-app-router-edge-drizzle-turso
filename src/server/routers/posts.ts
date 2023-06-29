import slugify from "slugify"
import { z } from "zod"
import { db } from "~/drizzle"
import { createUlid } from "~/src/utils/ulid"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { createPost } from "../use-cases/posts/create-post"

export const postsRouter = router({
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().default(10),
                offset: z.number().default(0),
            }),
        )
        .query(async ({ input }) => {
            const posts = await db.query.posts.findMany({
                with: {
                    author: {
                        columns: {
                            name: true,
                            image: true,
                        },
                    },
                },
                columns: {
                    title: true,
                    description: true,
                    slug: true,
                    createdAt: true,
                    updatedAt: true,
                },
                limit: input.limit,
                offset: input.offset,
                orderBy({ createdAt }, { desc }) {
                    return desc(createdAt)
                },
            })
            return posts
        }),
    create: privateProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
                body: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            return await createPost({
                id: createUlid(),
                slug: slugify(input.title, { lower: true }),
                title: input.title,
                description: input.description,
                body: input.body,
                authorId: user.id,
            })
        }),
})
