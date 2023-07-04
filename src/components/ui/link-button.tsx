import React from "react"
import { Button } from "./button"
import Link from "next/link"
import { cn } from "./lib/utils"

export type LinkButtonProps = {
    children: React.ReactNode
    href: string
    className?: string
}
export const LinkButton = ({ children, href, className }: LinkButtonProps) => {
    return (
        <Button className={cn("p-0", className)} variant={"link"} asChild>
            <Link href={href}>{children}</Link>
        </Button>
    )
}
