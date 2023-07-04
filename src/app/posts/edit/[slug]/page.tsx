import { notFound } from "next/navigation"
import { rsc } from "~/shared/server-rsc/trpc"
import { PostForm } from "~/src/components/posts/post-form"
import { cache } from "~/src/utils/cache"

export const runtime = "edge"
export const dynamic = "force-dynamic"
export const metadata = {
    title: "Edit post",
}

export default async function EditPostPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await cache(params.slug, () =>
        rsc.posts.get.fetch({ slug: params.slug }),
    )

    if (!post) return notFound()

    return (
        <PostForm
            slug={params.slug}
            post={{
                title: post.title,
                description: post.description,
                body: post.body,
            }}
        />
    )
}
