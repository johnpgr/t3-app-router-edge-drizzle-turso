import { rsc } from "~/shared/server-rsc/trpc"

export const useServerSession = async () => {
    return await rsc.session.fetch()
}
