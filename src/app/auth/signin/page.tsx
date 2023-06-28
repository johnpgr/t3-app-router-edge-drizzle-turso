"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { loginInputSchema, type TLoginInput } from "~/src/utils/schemas"
import { Spinner } from "~/src/components/spinner"
import { signIn } from "~/auth/client"
import { Github } from "lucide-react"
import { Dot } from "lucide-react"

export const runtime = "edge"

export default function LoginPage() {
    const router = useRouter()
    const authError = useSearchParams().get("error")
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<TLoginInput>({
        mode: "onBlur",
        resolver: zodResolver(loginInputSchema),
    })

    async function onSubmit(data: TLoginInput) {
        await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        })
        //Refresh here is for the root layout to update the session
        router.refresh()
        router.push("/")
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
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() =>
                        signIn("github", {
                            redirect: false,
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
    OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
    CallbackRouteError:
        "Another account already exists with the same e-mail address.",
} as const
