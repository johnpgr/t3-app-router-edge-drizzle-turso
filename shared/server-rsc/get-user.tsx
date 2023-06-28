import { decode } from "@auth/core/jwt"
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { env } from "~/config/env.mjs"

export interface User {
    id: string
    email: string
    name: string,
    image: string | null,
}

export type GetUser = () => Promise<User | null>

export function createGetUser(
    cookies: RequestCookies | ReadonlyRequestCookies,
) {
    return async () => {
        const newCookies = cookies.getAll().reduce((cookiesObj, cookie) => {
            cookiesObj[cookie.name] = cookie.value
            return cookiesObj
        }, {} as Record<string, string>)

        const sessionToken =
            newCookies["next-auth.session-token"] ??
            newCookies["__Secure-next-auth.session-token"]
        if (!sessionToken) return null

        // using jwt instead of db

        // const session = await db
        //     .select({
        //         user_id: users.id,
        //         user_name: users.name,
        //         user_email: users.email,
        //     })
        //     .from(sessions)
        //     .innerJoin(users, eq(users.id, sessions.userId))
        //     .where(eq(sessions.sessionToken, sessionToken))
        //     .limit(1)
        //     .get()

        const session = await decode({
            token: sessionToken,
            secret: env.AUTH_SECRET,
        })

        const user: User = {
            id: session?.sub ?? "unknown",
            name: session?.name ?? "unknown",
            email: session?.email ?? "unknown",
            image: session?.picture ?? null,
        }

        return user
    }
}
