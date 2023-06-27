import SignInButtons from "@/components/sign-in-options"
import { rsc } from "~/shared/server-rsc/trpc"

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "Home",
    description: "Home",
}

export default async function HomePage(){
    const user = await rsc.whoami.fetch()

    return (
        <>
            <div className="h-12" />
            <div className="flex w-full flex-col items-center gap-8">
                {!user && <SignInButtons />}
            </div>
        </>
    )
}

