"use client"
import clsx from "clsx"
import { ChevronDown, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { api } from "~/trpc/client/trpc-client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { signOut } from "~/auth/client"

export default function UserButtons() {
    const { data: user } = api.whoami.useQuery()
    const [isOpen, setIsOpen] = useState(false)
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="flex items-center gap-[2px] px-2 py-1 outline-ring">
                <Avatar>
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback>
                        {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <ChevronDown
                    size={16}
                    className={clsx({
                        "rotate-180 transform transition duration-300": isOpen,
                        "transition duration-300": !isOpen,
                    })}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                    <Link href="/profile">
                        <User size={16} />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() => signOut()}
                    className="cursor-pointer gap-2"
                >
                    <LogOut size={16} />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
