import { rsc } from "~/shared/server-rsc/trpc"
import { PostList } from "../components/posts/post-list"
import { HydrateClient } from "~/trpc/client/hydrate-client"

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "Home",
    description: "Home",
}

export default async function HomePage() {
    await rsc.posts.list.fetchInfinite({ limit: 10 })
    const state = await rsc.dehydrate()
    return (
        <div className="container px-8">
            <HydrateClient state={state} />
            <PostList />
        </div>
    )
}
