"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { CreatePostSchema, type TCreatePost } from "~/src/utils/schemas"
import { api } from "~/trpc/client/trpc-client"
import { Spinner } from "../spinner"
import { Button } from "../ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Dot } from "lucide-react"
import slugify from "slugify"
import { Card, CardContent } from "../ui/card"

export const PostForm = () => {
    const router = useRouter()
    const {
        mutateAsync: createPost,
        isLoading: isCreatingPost,
        error,
    } = api.posts.create.useMutation()
    const form = useForm<TCreatePost>({
        resolver: zodResolver(CreatePostSchema),
        mode: "onSubmit",
        defaultValues: {
            title: "",
            description: "",
            body: "",
        },
    })

    async function onSubmit(data: TCreatePost) {
        await createPost(data)
        router.push(`/post/${slugify(data.title, { lower: true })}`)
    }

    return (
        <Card className="container mx-auto max-w-5xl py-8 my-16">
            <CardContent>
                <h1 className="mb-8 text-center text-2xl font-bold">
                    New post
                </h1>
                {error && (
                    <div className="flex items-center text-sm font-medium text-red-700">
                        <Dot size={28} />
                        {error.message}
                    </div>
                )}
                <Form {...form}>
                    <form
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the title of your post
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the description of your post
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Body</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the body of your post
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="ml-auto gap-2"
                            disabled={isCreatingPost}
                        >
                            {isCreatingPost ? <Spinner /> : null}
                            Create Post
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
