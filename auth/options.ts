import GithubProvider from "@auth/core/providers/github"
import Credentials from "@auth/core/providers/credentials"
import { db } from "~/drizzle"
import { createDrizzleAdapter } from "./adapters/drizzle-orm"
import { type SolidAuthConfig } from "./server"
import { rsc } from "~/shared/server-rsc/trpc"
import { env } from "~/config/env.mjs"

export const authConfig: SolidAuthConfig = {
    // Configure one or more authentication providers
    adapter: createDrizzleAdapter(db),
    providers: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore growing pains
        GithubProvider({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
        }),
        // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // // @ts-ignore growing pains
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        // }),
        Credentials({
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: { label: "Password", type: "password" },
            },
            //@ts-expect-error idk
            async authorize(credentials) {
                if (!credentials) throw new Error("Missing credentials")

                const validCredentials = await rsc.credentials.validate.fetch({
                    email: credentials.email as string,
                    password: credentials.password as string,
                })

                if (!validCredentials) return null

                const user = await rsc.users.get.fetch({
                    email: credentials.email as string,
                })
                
                return user
            },
        }),
    ],
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
            }
            return session
        },
        jwt({ token, user }) {
            if (user) {
                token.picture = user.image
            }
            return token
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        error: "/auth/signin",
        signIn: "/auth/signin",
        newUser: "/auth/signup",
    },
}
