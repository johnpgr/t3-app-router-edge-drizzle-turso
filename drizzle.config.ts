import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
    schema: "./drizzle/schema.ts",
    driver: "turso",
    dbCredentials: {
        url: process.env.DB_URL as string,
        connectionString: process.env.DB_URL as string,
        authToken: process.env.DB_TOKEN,
    },
    out: "./drizzle/migrations"
};

export default config;
