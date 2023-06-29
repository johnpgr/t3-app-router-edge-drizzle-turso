import { rsc } from "~/shared/server-rsc/trpc"
import { PostList } from "../components/post-list"

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "Home",
    description: "Home",
}

export default async function HomePage() {
    const posts = await rsc.posts.list.fetch({})
    return (
        <div className="container px-8">
            <PostList posts={posts} />
        </div>
    )
}
