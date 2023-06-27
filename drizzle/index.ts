import { createClient } from "@libsql/client/web"
import { drizzle } from "drizzle-orm/libsql"
import { env } from "~/config/env.mjs"
import * as schema from "./schema"

const client = createClient({
    url: env.DB_URL,
    authToken: env.DB_TOKEN,
})

export const db = drizzle(client, {
    schema
})

export type DrizzleDb = typeof db
