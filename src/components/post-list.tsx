import { type Outputs } from "~/shared/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { Button } from "./ui/button"
import { formatDistanceToNow } from "date-fns"

export type Post = Outputs["posts"]["list"][number]

const PostRow = (props: { post: Post }) => {
    const { post } = props

    return (
        <li>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div>
                            <Link
                                href={`/profile/${post.author.name}`}
                                className="flex items-center gap-2"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={post.author.image ?? undefined}
                                    />
                                    <AvatarFallback>
                                        {post.author.name.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                            </Link>
                            <Button variant={"link"} asChild>
                                <Link href={`/post/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </Button>
                            <span className="text-xs text-neutral-500">
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="mx-4">
                        <span>{post.description}</span>
                        <Button
                            className="text-xs text-neutral-500"
                            asChild
                            variant="link"
                        >
                            <Link href={`/post/${post.slug}`}>Read more</Link>
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </li>
    )
}

export const PostList = (props: { posts: Post[] }) => {
    const { posts } = props
    return (
        <ul className="space-y-4">
            {posts.map((post) => (
                <PostRow key={post.slug} post={post} />
            ))}
        </ul>
    )
}
