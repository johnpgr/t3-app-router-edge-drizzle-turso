"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dot, Github } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "~/auth/client"
import { Spinner } from "~/src/components/spinner"
import { LoginUserSchema, type TLoginUser } from "~/src/utils/schemas"

export const runtime = "edge"

export default function LoginPage() {
    const authError = useSearchParams().get("error")
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<TLoginUser>({
        mode: "onBlur",
        resolver: zodResolver(LoginUserSchema),
    })

    async function onSubmit(data: TLoginUser) {
        await signIn("credentials", {
            callbackUrl: "/",
            email: data.email,
            password: data.password,
        })
    }

    return (
        <div className="container mx-auto mt-16 flex max-w-xl flex-col gap-4">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-4xl">Sign In</h1>
                <Link href="/auth/signup" className="text-sm text-green-600">
                    Need an account?
                </Link>
            </div>
            {authError && (
                <div className="flex items-center text-sm font-medium text-red-700">
                    <Dot size={28} />
                    {authError &&
                        (authErrors[authError as keyof typeof authErrors] ??
                            authErrors["default"])}
                </div>
            )}
            <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                />
                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                />
                {errors.password && (
                    <p className="-mt-2 text-xs text-red-700">
                        {errors.password.message}
                    </p>
                )}
                <Button className="gap-1" disabled={isSubmitting}>
                    {isSubmitting && (
                        <Spinner
                            size={14}
                            className="animate-spin text-white"
                        />
                    )}
                    Sign In
                </Button>
                <span className="mx-auto text-sm text-neutral-500 dark:text-neutral-300">
                    Or
                </span>
                <Button
                    className="gap-1"
                    onClick={() =>
                        void signIn("github", {
                            callbackUrl: "/",
                        })
                    }
                    type="button"
                >
                    <Github size={16} /> Sign in with Github
                </Button>
            </form>
        </div>
    )
}

const authErrors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    CallbackRouteError: "Try signing with a different account.",
    OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
} as const
