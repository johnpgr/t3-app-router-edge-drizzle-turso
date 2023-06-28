import type { Adapter, VerificationToken } from "@auth/core/adapters"
import { and, eq } from "drizzle-orm"
import { type DrizzleDb } from "~/drizzle"
import { accounts, sessions, users, verificationTokens } from "~/drizzle/schema"
import { createUlid } from "@/utils/ulid"

export function createDrizzleAdapter(database: DrizzleDb): Adapter {
    return {
        createUser: async (data) => {
            return database
                .insert(users)
                .values({
                    ...data,
                    id: createUlid(),
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
            return database.insert(sessions).values(session).returning().get()
        },
        getSessionAndUser: async (sessionToken) => {
            return (
                database
                    .select({
                        session: sessions,
                        user: users,
                    })
                    .from(sessions)
                    .where(eq(sessions.sessionToken, sessionToken))
                    .innerJoin(users, eq(users.id, sessions.userId))
                    .get() ?? null
            )
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
            return database
                .update(sessions)
                .set(session)
                .where(eq(sessions.sessionToken, session.sessionToken))
                .returning()
                .get()
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
                        emailVerified: users.emailVerified,
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
            return (
                database
                    .delete(sessions)
                    .where(eq(sessions.sessionToken, sessionToken))
                    .returning()
                    .get() ?? null
            )
        },
        createVerificationToken: async (verificationToken) => {
            return database
                .insert(verificationTokens)
                .values(verificationToken)
                .returning()
                .get()
        },
        useVerificationToken: async (verificationToken) => {
            try {
                return (database
                    .delete(verificationTokens)
                    .where(
                        and(
                            eq(
                                verificationTokens.identifier,
                                verificationToken.identifier,
                            ),
                            eq(
                                verificationTokens.token,
                                verificationToken.token,
                            ),
                        ),
                    )
                    .returning()
                    .get() ?? null) as Promise<VerificationToken | null>
            } catch {
                throw new Error("No verification token found.")
            }
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
