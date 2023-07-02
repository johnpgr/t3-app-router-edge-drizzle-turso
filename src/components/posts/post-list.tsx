"use client"

import { api } from "~/trpc/client/trpc-client"
import { PostRow } from "./post-row"
import { useEffect } from "react"
import { Spinner } from "../spinner"
import { useInView } from "react-intersection-observer"

export const PostList = () => {
    const { ref, inView } = useInView()
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
        api.posts.list.useInfiniteQuery(
            { limit: 10 },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            },
        )
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
    return (
        <>
            <ul className="space-y-4">
                {data?.pages.map((page) => (
                    page.posts.map((post) =>
                        <PostRow key={post.slug} post={post} />
                    )
                ))}
            </ul>
            <div ref={ref}>
                {isFetchingNextPage && (
                    <div className="flex w-full items-center justify-center p-8">
                        <Spinner size={32} />
                    </div>
                )}
            </div>
        </>
    )
}
