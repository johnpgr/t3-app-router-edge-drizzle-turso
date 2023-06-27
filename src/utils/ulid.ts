import { ulidFactory } from "ulid-workers"

export const createUlid = ulidFactory({
    monotonic: true,
})
