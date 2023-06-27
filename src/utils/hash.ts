import {
    SALT_LENGTH,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
    HASH_ITERATIONS,
} from '~/config/constants'

/**
 * This functions are defined here, because I didn't find any hashing library that works on Vercel's edge runtime
 * */
export const hashUtils = {
    generateSalt() {
        const saltBytes = new Uint8Array(SALT_LENGTH)
        crypto.getRandomValues(saltBytes)
        return Array.from(saltBytes, (byte) =>
            ('0' + byte.toString(16)).slice(-2),
        ).join('')
    },

    async hashPassword(password: string) {
        const salt = this.generateSalt()
        const saltBuffer = Buffer.from(salt, 'hex')
        const derivedKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits'],
        )
        const hashedKey = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: saltBuffer,
                iterations: HASH_ITERATIONS,
                hash: HASH_ALGORITHM,
            },
            derivedKey,
            HASH_KEY_LENGTH * 8,
        )
        const hashedPassword = Array.from(new Uint8Array(hashedKey))
            .map((byte) => ('0' + byte.toString(16)).slice(-2))
            .join('')
        return { salt, hashedPassword }
    },

    async comparePasswords(
        password: string,
        hashedPassword: string,
        salt: string,
    ) {
        const saltBuffer = Buffer.from(salt, 'hex')
        const derivedKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits'],
        )
        const hashedKey = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: saltBuffer,
                iterations: HASH_ITERATIONS,
                hash: HASH_ALGORITHM,
            },
            derivedKey,
            HASH_KEY_LENGTH * 8,
        )
        const hashedPasswordToCompare = Array.from(new Uint8Array(hashedKey))
            .map((byte) => ('0' + byte.toString(16)).slice(-2))
            .join('')
        return hashedPassword === hashedPasswordToCompare
    }
}
