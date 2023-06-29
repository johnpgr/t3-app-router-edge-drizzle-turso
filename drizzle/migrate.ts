import "dotenv/config"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import * as schema from "./schema"

const migrationsClient = createClient({
    url: process.env.DB_URL as string,
    authToken: process.env.DB_TOKEN,
})

const db = drizzle(migrationsClient, {
    schema
})

console.log("Running migrations...")

migrate(db, {
    migrationsFolder: "drizzle/migrations",
})
    .then(() => {
        console.log("Migrations complete")
    })
    .catch((err) => {
        console.error("Error running migrations", err)
    })
