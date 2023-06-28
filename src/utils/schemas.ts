import { z } from "zod"

export const loginInputSchema = z
    .object({
        email: z.string().email(),
        password: z.string(),
    })
    .strict()

export type TLoginInput = z.infer<typeof loginInputSchema>

// Password must contain at least 8 characters, one uppercase, one number and one special character
export const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/

export const registerInputSchema = z
    .object({
        email: z.string().email(),
        // Password must contain at least 8 characters, one uppercase, one lowercase and one number
        password: z.string().regex(passwordRegex),
        username: z.string(),
    })
    .strict()

export type TRegisterInput = z.infer<typeof registerInputSchema>

export const updateUserInputSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z
        .string()
        .regex(
            passwordRegex,
            "Password must contain at least 8 characters, one uppercase, one lowercase and one number",
        )
        .optional(),
    image: z.string().optional(),
})

export type TUpdateUserInput = z.infer<typeof updateUserInputSchema>
