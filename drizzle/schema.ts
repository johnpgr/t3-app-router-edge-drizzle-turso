import { relations } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { type ProviderType } from "next-auth/providers"

export const posts = sqliteTable("posts", {
    id: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    body: text("content").notNull(),
    authorId: text("author_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .notNull()
        .defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .notNull()
        .defaultNow(),
})

export const users = sqliteTable("users", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
    image: text("image"),
    hashedPassword: text("hashed_password"),
})

export const accounts = sqliteTable(
    "accounts",
    {
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<ProviderType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("provider_accountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compositePk: primaryKey(account.provider, account.providerAccountId),
    }),
)

export const sessions = sqliteTable("sessions", {
    sessionToken: text("session_token").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
    "verification_tokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (vt) => ({
        compositePk: primaryKey(vt.identifier, vt.token),
    }),
)

export const userToPosts = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}))

export const postsToUser = relations(users, ({ many }) => ({
    posts: many(posts),
}))

export const accountsToUser = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}))

export const userToAccounts = relations(users, ({ many }) => ({
    accounts: many(accounts),
}))
