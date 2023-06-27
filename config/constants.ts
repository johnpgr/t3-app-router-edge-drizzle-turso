export const SALT_LENGTH = 16
export const HASH_ITERATIONS = 100_000
export const HASH_KEY_LENGTH = 64
export const HASH_ALGORITHM = 'SHA-512'

export const JWT_EXPIRATION_TIME = {
    string: '7d',
    seconds: 60 * 60 * 24 * 7,
} as const
