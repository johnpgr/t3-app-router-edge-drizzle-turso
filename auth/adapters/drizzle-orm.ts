import type { Adapter, VerificationToken } from "@auth/core/adapters"
import { and, eq } from "drizzle-orm"
import { type DrizzleDb } from "~/drizzle"
import { accounts, sessions, users, verificationTokens } from "~/drizzle/schema"
import { ulid } from "@/utils/ulid"

export function createDrizzleAdapter(database: DrizzleDb): Adapter {
    return {
        createUser: async (data) => {
            return await database
                .insert(users)
                .values({ ...data, id: ulid() })
                .returning()
                .get()
        },
        getUser: (id) => {
            return (
                database.select().from(users).where(eq(users.id, id)).get() ??
                null
            )
        },
        getUserByEmail: (email) => {
            return (
                database
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .get() ?? null
            )
        },
        createSession: async (session) => {
            return await database
                .insert(sessions)
                .values(session)
                .returning()
                .get()
        },
        getSessionAndUser: async (sessionToken) => {
            return (
                (await database
                    .select({
                        session: sessions,
                        user: users,
                    })
                    .from(sessions)
                    .where(eq(sessions.sessionToken, sessionToken))
                    .innerJoin(users, eq(users.id, sessions.userId))
                    .get()) ?? null
            )
        },
        updateUser: async (user) => {
            return await database
                .update(users)
                .set(user)
                .where(eq(users.id, user.id))
                .returning()
                .get()
        },
        updateSession: async (session) => {
            return await database
                .update(sessions)
                .set(session)
                .where(eq(sessions.sessionToken, session.sessionToken))
                .returning()
                .get()
        },
        linkAccount: async (rawAccount) => {
            const updatedAccount = await database
                .insert(accounts)
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
        getUserByAccount: (account) => {
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
        deleteSession: (sessionToken) => {
            return (
                database
                    .delete(sessions)
                    .where(eq(sessions.sessionToken, sessionToken))
                    .returning()
                    .get() ?? null
            )
        },
        createVerificationToken: (verificationToken) => {
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
        deleteUser: (id) => {
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

            return undefined
        },
    }
}
