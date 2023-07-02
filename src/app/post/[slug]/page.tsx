import { notFound } from "next/navigation"
import { rsc } from "~/shared/server-rsc/trpc"
import { PostBody } from "~/src/components/posts/post-body"

export default async function PostPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await rsc.posts.get.fetch({ slug: params.slug })
    if (!post) return notFound()
    return <PostBody post={post} />
}
