import { z } from "zod"

export const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
export type TLoginUser = z.infer<typeof LoginUserSchema>

// Password must contain at least 8 characters, one uppercase, one number and one special character
export const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/

export const RegisterUserSchema = z.object({
    email: z.string().email(),
    // Password must contain at least 8 characters, one uppercase, one lowercase and one number
    password: z.string().regex(passwordRegex),
    username: z.string(),
})
export type TRegisterUser = z.infer<typeof RegisterUserSchema>

export const UpdateUserSchema = z.object({
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
export type TUpdateUser = z.infer<typeof UpdateUserSchema>

export const CreatePostSchema = z.object({
    title: z
        .string({
            required_error: "Title cannot be empty",
        })
        .nonempty("Title cannot be empty"),
    description: z
        .string({
            required_error: "Description cannot be empty",
        })
        .nonempty("Description cannot be empty"),
    body: z
        .string({
            required_error: "Body cannot be empty",
        })
        .nonempty("Body cannot be empty"),
})
export type TCreatePost = z.infer<typeof CreatePostSchema>
