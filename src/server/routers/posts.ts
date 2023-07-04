import { eq, lt } from "drizzle-orm"
import slugify from "slugify"
import { z } from "zod"
import { db } from "~/drizzle"
import { ulid } from "~/src/utils/ulid"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { createPost } from "../use-cases/posts/create-post"
import { calculateReadingTime } from "~/src/utils/read-time"
import { updatePost } from "../use-cases/posts/update-post"
import { TRPCError } from "@trpc/server"
import { posts } from "~/drizzle/schema"
import { revalidateTag } from "next/cache"

export const postsRouter = router({
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(),
            }),
        )
        .query(async ({ input }) => {
            const { cursor } = input
            const limit = input.limit ?? 20

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
                    id: true,
                    title: true,
                    description: true,
                    slug: true,
                    estimatedReadTime: true,
                    createdAt: true,
                    updatedAt: true,
                },
                limit: limit + 1,
                where: cursor ? ({ id }) => lt(id, cursor) : undefined,
                orderBy: ({ createdAt }, { desc }) => desc(createdAt),
            })

            let nextCursor: typeof cursor | undefined = undefined

            if (posts.length > limit) {
                const nextPost = posts.pop()
                nextCursor = nextPost?.id
            }

            return { posts, nextCursor }
        }),

    get: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            const { slug } = input
            return await db.query.posts.findFirst({
                where: (post, { eq }) => eq(post.slug, slug),
                with: {
                    author: {
                        columns: {
                            id:true,
                            name: true,
                            image: true,
                        },
                    },
                },
                columns: {
                    slug: true,
                    title: true,
                    description: true,
                    body: true,
                    estimatedReadTime: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
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
                id: ulid(),
                slug: slugify(input.title, { lower: true }),
                title: input.title,
                description: input.description,
                body: input.body,
                estimatedReadTime: calculateReadingTime(input.body),
                authorId: user.id,
            })
        }),

    update: privateProcedure
        .input(
            z.object({
                slug: z.string(),
                title: z.string(),
                description: z.string(),
                body: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { slug, title, description, body } = input

            const existingPost = await db.query.posts.findFirst({
                where: (post, { eq }) => eq(post.slug, slug),
                columns: {},
                with: {
                    author: {
                        columns: { id: true },
                    },
                },
            })

            if (!existingPost) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                })
            }

            if (existingPost.author.id !== ctx.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to edit this post",
                })
            }

            await updatePost(slug, {
                title,
                slug: slugify(title, { lower: true }),
                description,
                body,
                estimatedReadTime: calculateReadingTime(input.body),
            })

            revalidateTag(slug)
        }),

    delete: privateProcedure
        .input(z.object({ slug: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { slug } = input

            const existingPost = await db.query.posts.findFirst({
                where: (post, { eq }) => eq(post.slug, slug),
                columns: {},
                with: {
                    author: {
                        columns: { id: true },
                    },
                },
            })

            if (!existingPost) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                })
            }

            if (existingPost.author.id !== ctx.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to delete this post",
                })
            }

            await db
                .delete(posts)
                .where(eq(posts.slug, slug))
                .run()

            revalidateTag(slug)
        }),
})
