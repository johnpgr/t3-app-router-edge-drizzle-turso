"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { api } from "~/trpc/client/trpc-client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useRouter } from "next/navigation"
import { Spinner } from "../spinner"
import { useState } from "react"


export const DeletePostButton = (props: { slug: string }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { mutateAsync: deletePost, isLoading } = api.posts.delete.useMutation()

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"sm"}>
                    <Trash size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete this post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="gap-2"
                        disabled={isLoading}
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async (e) => {
                            e.preventDefault()
                            await deletePost({ slug: props.slug })
                            router.push("/")
                        }}
                    >
                        {isLoading && <Spinner className="text-black" size={16} />}
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
