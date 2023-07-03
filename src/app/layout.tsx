import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { type PropsWithChildren } from "react"
import { rsc } from "~/shared/server-rsc/trpc"
import { HydrateClient } from "~/trpc/client/hydrate-client"
import { ClientProvider } from "~/trpc/client/trpc-client"
import { ThemeSwitch } from "../components/theme-switch"
import { Button } from "../components/ui/button"
import UserButtons from "../components/user-buttons"

export const metadata = {
    title: {
        default: "T3 App Router (Edge)",
        template: "%s | T3 App Router (Edge)",
    },
    description: "Example app.",
}

export default async function RootLayout(props: PropsWithChildren) {
    const user = await rsc.whoami.fetch()
    const state = await rsc.dehydrate()
    return (
        // suppressHydrationWarning is required to avoid a console warning during development when using next-themes https://github.com/pacocoursey/next-themes#with-app
        <html lang="en" suppressHydrationWarning>
            <body
                className="min-h-screen font-sans bg-background text-neutral-800 antialiased dark:text-neutral-100"
            >
                <ClientProvider>
                    <HydrateClient state={state} />
                    <ThemeProvider attribute="class" enableSystem>
                        <div className="flex min-h-screen flex-col">
                            <header className="bg-white dark:bg-neutral-950 flex justify-end px-16 py-4">
                                <Button
                                    className="mr-auto p-0 text-2xl font-bold text-neutral-600 dark:text-neutral-400"
                                    variant={"link"}
                                    asChild
                                >
                                    <Link href="/">Acme</Link>
                                </Button>
                                <Button asChild variant="link">
                                    <Link href="/posts/new">New post</Link>
                                </Button>
                                {user ? (
                                    <UserButtons />
                                ) : (
                                    <Button asChild variant={"link"}>
                                        <Link href="/auth/signin">Login</Link>
                                    </Button>
                                )}
                                <ThemeSwitch />
                            </header>
                            <main className="flex-1">{props.children}</main>
                        </div>
                    </ThemeProvider>
                </ClientProvider>
            </body>
        </html>
    )
}
