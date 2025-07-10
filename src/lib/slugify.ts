/**
 * Build the canonical slug used in article URLs, combining the public index
 * with a slugified title (e.g. "42-learn-malloc").
 */
export function buildArticleSlug(publicIndex: number, title: string): string {
    return `${publicIndex}-${slugify(title)}`;
}

export function slugify(text: string): string {
    return (
        text
            .toLowerCase()
            .trim()
            // Replace non-alphanumeric characters with a dash
            .replace(/[^a-z0-9\s-]/g, '')
            // Convert consecutive whitespace to single dashes
            .replace(/\s+/g, '-')
            // Collapse multiple dashes
            .replace(/-+/g, '-')
    );
}
