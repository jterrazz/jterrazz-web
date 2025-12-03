/**
 * Converts a title from Title Case to sentence case.
 * Preserves capitalization after colons (treated as new sentences).
 *
 * Examples:
 * - "A Super Title" → "A super title"
 * - "A Super: Title Of Something" → "A super: Title of something"
 */
export function toSentenceCase(title: string): string {
    if (!title) return title;

    // Split by colon to handle each segment as a separate sentence
    const segments = title.split(':');

    return segments
        .map((segment, index) => {
            const trimmed = segment.trim();
            if (!trimmed) return segment;

            // Preserve leading whitespace for segments after colon
            const leadingSpace = index > 0 && segment.startsWith(' ') ? ' ' : '';

            // Convert to sentence case: first letter uppercase, rest lowercase
            const sentenceCased = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

            return leadingSpace + sentenceCased;
        })
        .join(':');
}

/**
 * Replaces em dashes (—) with ", " in a string.
 */
export function replaceEmDashes(text: string): string {
    if (!text) return text;
    return text.replace(/—/g, ', ');
}

/**
 * Sanitizes an article title by:
 * 1. Converting to sentence case (preserving capitalization after colons)
 * 2. Replacing em dashes with ", "
 */
export function sanitizeTitle(title: string): string {
    if (!title) return title;
    return replaceEmDashes(toSentenceCase(title));
}
