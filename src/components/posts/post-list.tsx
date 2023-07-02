"use client"

import { api } from "~/trpc/client/trpc-client"
import { PostRow } from "./post-row"
import { useEffect, useRef } from "react"
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
    const fetchNextPageRef = useRef(fetchNextPage)
    fetchNextPageRef.current = fetchNextPage

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPageRef.current()
        }
    }, [inView, hasNextPage, isFetchingNextPage])
    return (
        <>
            <ul className="space-y-4">
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
