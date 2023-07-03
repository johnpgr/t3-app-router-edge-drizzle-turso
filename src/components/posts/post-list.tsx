"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { api } from "~/trpc/client/trpc-client"
import { Spinner } from "../spinner"
import { PostRow } from "./post-row"

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
    }, [inView, hasNextPage, isFetchingNextPage])
    return (
        <>
            <ul className="space-y-4 my-16 max-w-2xl mx-auto container">
                {data?.pages.map((page) =>
                    page.posts.map((post) => (
                        <PostRow key={post.slug} post={post} />
                    )),
                )}
            </ul>
            {isFetchingNextPage ? (
                <div className="flex w-full items-center justify-center p-8">
                    <Spinner size={32} />
                </div>
            ) : (
                <div ref={ref} className="h-1 w-full bg-transparent" />
            )}
        </>
    )
}
