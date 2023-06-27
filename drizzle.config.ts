import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
    schema: "./src/db/schema.ts",
    dbCredentials: {
        connectionString: process.env.DB_URL as string,
        authToken: process.env.DB_TOKEN,
    },
    out: "./drizzle/migrations"
};

export default config;
