import { redirect } from "next/navigation"
import { PostForm } from "~/src/components/posts/post-form"
import { useServerSession } from "@/utils/session/server"

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "New Post",
}

export default async function NewPostPage() {
    const user = await useServerSession()
    if (!user) redirect("/auth/signin")

    return <PostForm />
}
