"use client"

import { signOut } from "~/auth/client"
import { Button } from "./ui/button"

export const SignOutButton = () => {
    async function handleSignOut() {
        await signOut()
    }
    return (
        <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleSignOut}
        >
            Sign Out
        </Button>
    )
}
