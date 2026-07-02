/**
 * Helpers for preparing article markdown for the editorial layout.
 *
 * The masthead (title + hero image) is rendered from structured metadata, so
 * the leading title and cover image must be stripped from the markdown body to
 * avoid rendering them twice.
 */

// Matches a leading markdown image, e.g. `![alt](assets/thumbnail.jpg)`.
const LEADING_IMAGE = /^\s*!\[[^\]]*\]\((?<src>[^)]*)\)\s*/;

// Matches a leading level-1 heading line, e.g. `# Title`.
const LEADING_H1 = /^\s*#\s+(?<title>.+?)\s*(?:\n|$)/;

type StrippedHero = {
    /** Image source found at the top of the content, if any (fallback hero). */
    heroFromContent: null | string;
    /** Content with the leading image removed. */
    body: string;
};

/**
 * Remove a leading cover image from the markdown body. Returns the image source
 * (so it can be used as a hero fallback) and the remaining body.
 */
export function stripLeadingHero(markdown: string): StrippedHero {
    const match = LEADING_IMAGE.exec(markdown);
    if (!match) {
        return { body: markdown, heroFromContent: null };
    }
    return {
        body: markdown.slice(match[0].length),
        heroFromContent: match[1] || null,
    };
}

/**
 * Remove a leading level-1 heading (the article title) from the markdown body.
 */
export function stripLeadingTitle(markdown: string): string {
    const match = LEADING_H1.exec(markdown);
    if (!match) {
        return markdown;
    }
    return markdown.slice(match[0].length);
}

/**
 * Strip both the leading hero image and the leading title from the body, in the
 * order they appear in authored content (image first, then title).
 */
export function stripArticleMasthead(markdown: string): StrippedHero {
    const { body, heroFromContent } = stripLeadingHero(markdown);
    return { body: stripLeadingTitle(body), heroFromContent };
}

/**
 * Estimate reading time in whole minutes (rounded up, minimum 1) from a word
 * count at an average reading speed.
 */
export function calculateReadingTimeMinutes(content: string): number {
    const wordsPerMinute = 225; // Standard average reading speed
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(minutes, 1);
}
