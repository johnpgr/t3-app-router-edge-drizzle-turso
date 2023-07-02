import { Loader2 } from "lucide-react"
import React from "react"
import { cn } from "@/components/ui/lib/utils"

export const Spinner = (props: { className?: string; size?: number }) => {
    return (
        <Loader2
            size={props.size ?? 16}
            className={cn("animate-spin text-primary", props.className)}
        />
    )
}
