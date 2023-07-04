import Markdown from "markdown-to-jsx"
import { type Outputs } from "~/shared/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { LinkButton } from "../ui/link-button"
import { DeletePostButton } from "./delete-post-button"
import { useServerSession } from "~/src/utils/session/server"
import { PreBlock } from "../syntax-highlighter"

type Post = Outputs["posts"]["get"]

export const PostBody = async (props: { post: NonNullable<Post> }) => {
    const user = await useServerSession()

    return (
        <Card className="container mx-auto my-8 max-w-5xl py-8">
            <CardContent>
                <div className="relative mx-auto flex flex-col items-center">
                    {user?.id === props.post.author.id && (
                        <div className="absolute right-0 top-0 flex gap-2">
                            <Button variant={"secondary"} size={"sm"} asChild>
                                <Link href={`/posts/edit/${props.post.slug}`}>
                                    <Pencil size={16} />
                                </Link>
                            </Button>
                            <DeletePostButton slug={props.post.slug} />
                        </div>
                    )}
                    <Avatar className="h-20 w-20">
                        <AvatarImage
                            src={props.post.author.image ?? ""}
                            alt={props.post.author.name ?? "Avatar image"}
                        />
                        <AvatarFallback>
                            {props.post.author.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <LinkButton
                        href={`/profile/${props.post.author.name ?? ""}`}
                        className="text-lg text-neutral-600 dark:text-neutral-400"
                    >
                        {props.post.author.name}
                    </LinkButton>
                </div>
                <h1 className="mb-4 text-center text-5xl font-bold">
                    {props.post.title}
                </h1>
                <h2 className="mb-2 text-center text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                    {props.post.description}
                </h2>
                <h3 className="mb-8 text-center text-xs text-neutral-500">
                    {props.post.estimatedReadTime} min read
                </h3>
                <article className="prose max-w-none dark:prose-invert lg:prose-xl">
                    <Markdown
                        options={{
                            disableParsingRawHTML: true,
                            overrides: {
                                pre: PreBlock
                            },
                        }}
                    >
                        {props.post.body}
                    </Markdown>
                </article>
            </CardContent>
        </Card>
    )
}
