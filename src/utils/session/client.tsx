import { api } from "~/trpc/client/trpc-client"

export const useSession = () => {
    const {data,isLoading} = api.session.useQuery()

    return {
        session: data ?? null,
        isLoading
    }
}
