import { redirect } from "next/navigation";
import { rsc } from "~/shared/server-rsc/trpc";
import { PostForm } from "~/src/components/posts/post-form";

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "New Post",
}

export default async function NewPostPage() {
    const user = await rsc.whoami.fetch()
    if (!user) redirect("/auth/signin")

    return <PostForm />
}
