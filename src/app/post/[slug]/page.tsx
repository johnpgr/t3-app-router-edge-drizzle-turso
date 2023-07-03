import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { rsc } from "~/shared/server-rsc/trpc"
import { PostBody } from "~/src/components/posts/post-body"
import { cache } from "~/src/utils/cache"

export const runtime = "edge"

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = params

    const post = await cache(slug, () => rsc.posts.get.fetch({ slug }))

    if (!post) return notFound()

    return {
        title: post.title,
    }
}

export default async function PostPage({
    params,
}: Props) {
    const { slug } = params

    const post = await cache(slug, () => rsc.posts.get.fetch({ slug }))

    if (!post) return notFound()

    return <PostBody post={post} />
}
