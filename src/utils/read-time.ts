/**
 *  Calculate the reading time in minutes of an post
 * */
export function calculateReadingTime(articleBody: string): number {
    const wordsPerMinute = 200
    const words = articleBody.trim().split(/\s+/).length
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute)

    return readingTimeMinutes
}
