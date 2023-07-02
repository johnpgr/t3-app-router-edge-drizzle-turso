import type { Adapter, VerificationToken } from "@auth/core/adapters"
import { and, eq } from "drizzle-orm"
import { type DrizzleDb } from "~/drizzle"
import { accounts, users } from "~/drizzle/schema"
import { ulid } from "@/utils/ulid"

export function createDrizzleAdapter(database: DrizzleDb): Adapter {
    return {
        createUser: async (data) => {
            return database
                .insert(users)
                .values({
                    ...data,
                    id: ulid(),
                    name:
                        data.name ??
                        `Unknown${Math.random().toString(36).slice(2, 7)}`,
                })
                .returning()
                .get()
        },
        getUser: async (id) => {
            return (
                database.select().from(users).where(eq(users.id, id)).get() ??
                null
            )
        },
        getUserByEmail: async (email) => {
            return (
                database
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .get() ?? null
            )
        },
        createSession: async (session) => {
            throw new Error("Not implemented")
        },
        getSessionAndUser: async (sessionToken) => {
            throw new Error("Not implemented")
        },
        updateUser: async (user) => {
            return database
                .update(users)
                .set({
                    ...user,
                    name: user.name as string,
                })
                .where(eq(users.id, user.id as string))
                .returning()
                .get()
        },
        updateSession: async (session) => {
            throw new Error("Not implemented")
        },
        linkAccount: async (rawAccount) => {
            const updatedAccount = await database
                .insert(accounts)
                // @ts-expect-error idk
                .values(rawAccount)
                .returning()
                .get()

            const account: ReturnType<Adapter["linkAccount"]> = {
                ...updatedAccount,
                access_token: updatedAccount.access_token ?? undefined,
                token_type: updatedAccount.token_type ?? undefined,
                id_token: updatedAccount.id_token ?? undefined,
                refresh_token: updatedAccount.refresh_token ?? undefined,
                scope: updatedAccount.scope ?? undefined,
                expires_at: updatedAccount.expires_at ?? undefined,
                session_state: updatedAccount.session_state ?? undefined,
            }

            return account
        },
        getUserByAccount: async (account) => {
            return (
                database
                    .select({
                        id: users.id,
                        email: users.email,
                        image: users.image,
                        name: users.name,
                    })
                    .from(users)
                    .innerJoin(
                        accounts,
                        and(
                            eq(
                                accounts.providerAccountId,
                                account.providerAccountId,
                            ),
                            eq(accounts.provider, account.provider),
                        ),
                    )
                    .get() ?? null
            )
        },
        deleteSession: async (sessionToken) => {
            throw new Error("Not implemented")
        },
        createVerificationToken: async (verificationToken) => {
            throw new Error("Not implemented")
        },
        useVerificationToken: async (verificationToken) => {
            throw new Error("Not implemented")
        },
        deleteUser: async (id) => {
            return database
                .delete(users)
                .where(eq(users.id, id))
                .returning()
                .get()
        },
        unlinkAccount: async (account) => {
            await database
                .delete(accounts)
                .where(
                    and(
                        eq(
                            accounts.providerAccountId,
                            account.providerAccountId,
                        ),
                        eq(accounts.provider, account.provider),
                    ),
                )
                .run()
        },
    }
}
