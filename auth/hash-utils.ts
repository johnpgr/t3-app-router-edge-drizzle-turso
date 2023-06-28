import {
    SALT_LENGTH,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
    HASH_ITERATIONS,
} from "~/config/constants"

/**
 * This functions are defined here, because I didn't find any hashing library that works on Vercel's edge runtime
 * */
export const hashUtils = {
    generateSalt() {
        const saltBytes = new Uint8Array(SALT_LENGTH)
        crypto.getRandomValues(saltBytes)
        const salt = Buffer.from(saltBytes).toString("base64")
        return salt
    },

    async hashPassword(password: string) {
        const salt = this.generateSalt()
        const saltBuffer = Buffer.from(salt, "base64")
        const derivedKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits"],
        )
        const hashedKey = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: saltBuffer,
                iterations: HASH_ITERATIONS,
                hash: HASH_ALGORITHM,
            },
            derivedKey,
            HASH_KEY_LENGTH * 8,
        )
        const hashedPassword = Buffer.from(hashedKey).toString("base64")
        const combinedHash = `${salt}$${hashedPassword}`
        return combinedHash
    },

    async comparePasswords(password: string, combinedHash: string) {
        const [salt, hashedPassword] = combinedHash.split("$")
        const saltBuffer = Buffer.from(salt as string, "base64")
        const derivedKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits"],
        )
        const hashedKey = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: saltBuffer,
                iterations: HASH_ITERATIONS,
                hash: HASH_ALGORITHM,
            },
            derivedKey,
            HASH_KEY_LENGTH * 8,
        )
        const hashedPasswordToCompare =
            Buffer.from(hashedKey).toString("base64")
        return hashedPassword === hashedPasswordToCompare
    },
}
