"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { type TRegisterInput, registerInputSchema } from "~/src/utils/schemas"
import { api } from "~/trpc/client/trpc-client"
import { Spinner } from "~/src/components/spinner"
import { Dot } from "lucide-react"

export const runtime = "edge"

export default function RegisterPage() {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<TRegisterInput>({
        mode: "onBlur",
        resolver: zodResolver(registerInputSchema),
    })

    const {
        mutateAsync: createUser,
        error,
        isLoading,
    } = api.users.create.useMutation()

    async function onSubmit(data: TRegisterInput) {
        await createUser(data)

        //Refresh here is for the root layout to update the session
        router.refresh()
        router.push("/")
    }

    return (
        <div className="container mx-auto mt-16 flex max-w-xl flex-col gap-4">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-4xl">Sign Up</h1>
            </div>
            {error && (
                <div className="flex items-center text-sm font-medium text-red-700">
                    <Dot size={28} />
                    {error.message}
                </div>
            )}
            <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Input
                    {...register("username")}
                    type="text"
                    placeholder="Username"
                />
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
                <Button className="ml-auto w-fit gap-1" disabled={isLoading}>
                    {isLoading && (
                        <Spinner
                            size={14}
                            className="animate-spin text-white"
                        />
                    )}
                    Sign Up
                </Button>
            </form>
        </div>
    )
}
