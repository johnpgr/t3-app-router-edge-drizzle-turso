import { eq, type InferModel } from "drizzle-orm"
import { db } from "~/drizzle"
import { posts } from "~/drizzle/schema"

export type TCreatePost = InferModel<typeof posts, "insert">

export async function createPost(post: TCreatePost) {
    const existingPost = await db
        .select({
            id: posts.id,
        })
        .from(posts)
        .where(eq(posts.slug, post.slug))
        .get()

    if (existingPost) {
        post.slug = `${post.slug}-${Math.random()
            .toString(36)
            .substring(2, 12)}`
    }

    return await db.insert(posts).values(post).returning({ id: posts.id }).get()
}
