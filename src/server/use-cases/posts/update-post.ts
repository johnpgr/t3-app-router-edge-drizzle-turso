import { eq, type InferModel } from "drizzle-orm"
import { db } from "~/drizzle"
import { posts } from "~/drizzle/schema"

export type TCreatePost = InferModel<typeof posts, "insert">

export async function updatePost(slug: string, post: Omit<TCreatePost, "id" | "authorId">) {
    return await db
        .update(posts)
        .set(post)
        .where(eq(posts.slug, slug))
        .returning({ id: posts.id })
        .get()
}
