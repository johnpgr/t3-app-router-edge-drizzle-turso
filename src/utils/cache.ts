import { unstable_cache } from "next/cache"

/**
 * Cache a function call with a key
 * Use this to cache TRPC RSC calls, since TanstackQuery cache doesn't work on server
 * @param key The key to use for the cache
 * @param callback The function to call
 * @param options Options for the cache
 * @returns The result of the callback
 * */
export async function cache<T>(
    key: string | string[],
    callback: () => Promise<T>,
): Promise<T> {
    return await unstable_cache(
        callback,
        Array.isArray(key) ? key : [key],
        { tags: Array.isArray(key) ? key : [key] },
    )()
}
