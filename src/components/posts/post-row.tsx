import type { Outputs } from "~/shared/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent } from "../ui/card"
import { LinkButton } from "../ui/link-button"

export type Post = Outputs["posts"]["list"]["posts"][number]

export const PostRow = (props: { post: Post }) => {
    const { post } = props

    return (
        <li>
            <Card>
                <CardContent className="flex flex-col p-4">
                    <div className="flex flex-col items-center">
                        <div className="flex w-full flex-col">
                            <div className="flex gap-2">
                                <Link
                                    href={`/profile/${post.author.name ?? ""}`}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={post.author.image ?? undefined}
                                        />
                                        <AvatarFallback>
                                            {post.author.name?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex flex-col">
                                    <LinkButton
                                        className="h-fit text-sm text-neutral-600 dark:text-neutral-400"
                                        href={`/profile/${post.author.name ?? ""
                                            }`}
                                    >
                                        {post.author.name ?? ""}
                                    </LinkButton>
                                    <time
                                        dateTime={post.createdAt.toISOString()}
                                        title={format(
                                            post.createdAt,
                                            "EEEE, MMMM d yyyy, h:mm:ss a",
                                        )}
                                        className="text-xs text-neutral-500"
                                    >
                                        {format(post.createdAt, "MMM d")}
                                    </time>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-8 py-2">
                            <LinkButton
                                className="h-fit text-2xl font-bold"
                                href={`/post/${post.slug}`}>
                                {post.title}
                            </LinkButton>
                        </div>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">
                        {post.estimatedReadTime} min read
                    </span>
                </CardContent>
            </Card>
        </li>
    )
}
