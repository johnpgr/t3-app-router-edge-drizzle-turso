import { type InferModel } from "drizzle-orm"
import { db } from "~/drizzle"
import { users } from "~/drizzle/schema"
import { ulid } from "~/src/utils/ulid"

export type TCreateUser = InferModel<typeof users, "insert">

export async function createUser(user: TCreateUser) {
    const foundEmail = await db.query.users.findFirst({
        where: ({ email }, { eq }) => eq(email, user.email),
        columns: {
            email: true,
        },
    })

    if (foundEmail) throw new Error("Email already in use")

    const foundUsername = await db.query.users.findFirst({
        where: ({ name }, { eq }) => eq(name, user.name),
        columns: {
            name: true,
        },
    })

    if (foundUsername) throw new Error("Username already in use")

    const createdUser = await db
        .insert(users)
        .values({
            id: ulid(),
            email: user.email,
            hashedPassword: user.hashedPassword,
            image: user.image,
            name: user.name,
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
        })
        .get()

    return createdUser
}
