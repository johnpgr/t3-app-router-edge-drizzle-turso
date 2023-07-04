import { ProfileSettingsForm } from "./profile-settings-form"
import { redirect } from "next/navigation"
import { useServerSession } from "@/utils/session/server"

export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "Profile",
    description: "Your profile.",
}

export default async function ProfilePage() {
    const user = await useServerSession()
    if (!user) redirect("/auth/signin")
    return (
        <div className="container mx-auto max-w-4xl py-16">
            <h1 className="mb-8 text-center text-4xl font-bold">
                Your profile
            </h1>
            <ProfileSettingsForm />
        </div>
    )
}


