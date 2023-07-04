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
import { useToast } from "../ui/use-toast"
import { SetDynamicRoute } from "~/src/utils/dynamic-route"

export const PostForm = ({
    slug,
    post,
}: {
    slug?: string
    post?: TCreatePost
}) => {
    const router = useRouter()
    const { toast } = useToast()

    const {
        mutateAsync: createPost,
        isLoading: isCreatingPost,
        error: createPostError,
    } = api.posts.create.useMutation()

    const {
        mutateAsync: updatePost,
        isLoading: isUpdatingPost,
        error: updatePostError,
    } = api.posts.update.useMutation()

    const form = useForm<TCreatePost>({
        resolver: zodResolver(CreatePostSchema),
        mode: "onSubmit",
        defaultValues: post ?? {
            title: "",
            description: "",
            body: "",
        },
    })

    async function onSubmit(data: TCreatePost) {
        const { title, body, description } = data

        if (slug && post) {
            await updatePost({ title, body, description, slug })
        } else {
            await createPost(data)
        }

        if (!slug || !post) {
            router.push(`/post/${slugify(data.title, { lower: true })}`)
        } else {
            toast({
                title: "Post updated",
                description: "Your post has been updated successfully ✅",
            })
        }
    }

    return (
        <>
            <SetDynamicRoute />
            <Card className="container mx-auto my-16 max-w-5xl py-8">
                <CardContent>
                    <h1 className="mb-8 text-center text-2xl font-bold">
                        New post
                    </h1>
                    {createPostError && (
                        <div className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {createPostError.message}
                        </div>
                    )}
                    {updatePostError && (
                        <div className="flex items-center text-sm font-medium text-red-700">
                            <Dot size={28} />
                            {updatePostError.message}
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
                                disabled={isCreatingPost || isUpdatingPost}
                            >
                                {isCreatingPost || isUpdatingPost ? (
                                    <Spinner className="text-black" size={16} />
                                ) : null}
                                {slug && post ? "Update" : "Create"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
