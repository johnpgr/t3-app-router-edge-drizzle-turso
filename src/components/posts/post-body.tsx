import { type Outputs } from "~/shared/utils"
import Markdown from "markdown-to-jsx"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link"

type Post = Outputs["posts"]["get"]

export const PostBody = (props: { post: NonNullable<Post> }) => {
    return (
        <div className="container mx-auto max-w-5xl py-16">
            <div className="mx-auto flex flex-col items-center">
                <Avatar className="w-20 h-20">
                    <AvatarImage
                        src={props.post.author.image ?? ""}
                        alt={props.post.author.name ?? "Avatar image"}
                    />
                    <AvatarFallback>
                        {props.post.author.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Button variant={"link"} className="p-0 text-lg text-neutral-600 dark:text-neutral-400" asChild>
                    <Link href={`/profile/${props.post.author.name ?? ""}`}>
                        {props.post.author.name}
                    </Link>
                </Button>
            </div>
            <h1 className="mb-4 text-center text-5xl font-bold">
                {props.post.title}
            </h1>
            <h2 className="mb-8 text-center text-lg text-neutral-500 dark:text-neutral-300">
                {props.post.description}
            </h2>
            <article className="prose max-w-none dark:prose-invert lg:prose-xl">
                <Markdown>{props.post.body}</Markdown>
            </article>
        </div>
    )
}
