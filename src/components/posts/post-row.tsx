import type { Outputs } from "~/shared/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { Card, CardContent } from "../ui/card"

export type Post = Outputs["posts"]["list"]["posts"][number]

export const PostRow = (props: { post: Post }) => {
    const { post } = props

    return (
        <li>
            <Card>
                <CardContent className="p-4 flex flex-col">
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col w-full">
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
                                    <Button
                                        variant="link"
                                        asChild
                                        className="h-fit p-0 text-sm text-neutral-600 dark:text-neutral-400"
                                    >
                                        <Link
                                            href={`/profile/${post.author.name ?? ""
                                                }`}
                                        >
                                            {post.author.name ?? ""}
                                        </Link>
                                    </Button>
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
                            <Button
                                variant={"link"}
                                asChild
                                className="h-fit p-0 text-2xl font-bold"
                            >
                                <Link href={`/post/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <span className="text-xs text-neutral-500 ml-auto">
                        {post.estimatedReadTime} min read
                    </span>
                </CardContent>
            </Card>
        </li>
    )
}
