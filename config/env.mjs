import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        DB_URL: z.string().min(1),
        DB_TOKEN: z.string().min(1),
        NEXTAUTH_URL: z.string().min(1),
        NEXTAUTH_SECRET: z.string().min(1),
    },
    client: {},
    // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
    runtimeEnv: {
        DB_URL: process.env.DB_URL,
        DB_TOKEN: process.env.DB_TOKEN,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    // experimental__runtimeEnv: {
    //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
})
