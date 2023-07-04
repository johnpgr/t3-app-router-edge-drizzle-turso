"use client"

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dot } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "~/src/components/ui/card"
import { UpdateUserSchema, type TUpdateUser } from "~/src/utils/schemas"
import { useSession } from "~/src/utils/session/client"
import { api } from "~/trpc/client/trpc-client"

export const ProfileSettingsForm = () => {
    const { session: user } = useSession()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TUpdateUser>({
        resolver: zodResolver(UpdateUserSchema),
        mode: "onSubmit",
    })

    const { mutateAsync: updateUser, error } = api.users.update.useMutation()

    async function onSubmit(data: TUpdateUser) {
        // remove empty strings from data
        for (const val in data) {
            //@ts-expect-error ignore
            if (data[val] === "") delete data[val]
        }

        // remove unchanged values from data
        if (data.email === user?.email) delete data.email
        if (data.username === user?.name) delete data.username
        if (data.image === user?.image) delete data.image

        await updateUser(data)
        router.refresh()
    }

    return (
        <Card>
            <CardContent>
                <form
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 pt-8"
                >
                    {error && (
                        <p className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {error.message}
                        </p>
                    )}
                    <Input
                        placeholder="URL of profile picture"
                        defaultValue={user?.image ?? undefined}
                        {...register("image")}
                    />
                    {errors.image && (
                        <p className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {errors.image.message}
                        </p>
                    )}
                    <Input
                        placeholder="Username"
                        defaultValue={user?.name ?? undefined}
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {errors.username.message}
                        </p>
                    )}

                    <Input
                        type="email"
                        placeholder="Email"
                        defaultValue={user?.email ?? undefined}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {errors.email.message}
                        </p>
                    )}

                    <Input
                        type="password"
                        placeholder="New password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {errors.password.message}
                        </p>
                    )}

                    <Button
                        className="ml-auto mt-2 w-fit gap-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Spinner size={16} className="text-white" />
                        ) : null}
                        Update settings
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
