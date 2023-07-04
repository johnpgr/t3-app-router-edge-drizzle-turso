import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { type PropsWithChildren } from "react"
import { rsc } from "~/shared/server-rsc/trpc"
import { HydrateClient } from "~/trpc/client/hydrate-client"
import { ClientProvider } from "~/trpc/client/trpc-client"
import { ThemeSwitch } from "../components/theme-switch"
import UserButtons from "../components/user-buttons"
import { useServerSession } from "@/utils/session/server"
import { LinkButton } from "../components/ui/link-button"
import { Toaster } from "../components/ui/toaster"

export const metadata = {
    title: {
        default: "T3 App Router (Edge)",
        template: "%s | T3 App Router (Edge)",
    },
    description: "Example app.",
}

export default async function RootLayout(props: PropsWithChildren) {
    const user = await useServerSession()
    return (
        // suppressHydrationWarning is required to avoid a console warning during development when using next-themes https://github.com/pacocoursey/next-themes#with-app
        <html lang="en" suppressHydrationWarning>
            <body
                className="min-h-screen font-sans bg-background text-neutral-800 antialiased dark:text-neutral-100"
            >
                <ClientProvider>
                    <HydrateClient state={await rsc.dehydrate()} />
                    <ThemeProvider attribute="class" enableSystem>
                        <div className="flex min-h-screen flex-col">
                            <header className="bg-white dark:bg-neutral-950 flex justify-end px-16 py-4">
                                <LinkButton href="/" className="mr-auto text-2xl font-bold text-neutral-600 dark:text-neutral-400">
                                    Acme
                                </LinkButton>
                                <LinkButton href="/posts/new">
                                    New post
                                </LinkButton>
                                {user ? (
                                    <UserButtons />
                                ) : (
                                    <LinkButton href="/auth/signin">
                                        Login
                                    </LinkButton>
                                )}
                                <ThemeSwitch />
                            </header>
                            <main className="flex-1">{props.children}</main>
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </ClientProvider>
            </body>
        </html>
    )
}
