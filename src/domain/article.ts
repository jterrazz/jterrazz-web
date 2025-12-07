export enum ArticleCategory {
    Insight = 'insight',
    Experiment = 'experiment',
}

export type ArticleLanguage = 'en' | 'fr';

export interface Article {
    content: {
        [key in ArticleLanguage]?: string;
    };
    imageUrl: string;
    metadata: {
        category: ArticleCategory;
        dateModified: string;
        datePublished: string;
        description: Record<ArticleLanguage, string>;
        series?: string;
        title: Record<ArticleLanguage, string>;
    };
    publicIndex: number;
    published: boolean;
}

// Raw input for article creation (before domain sanitization)
export type RawArticleInput = {
    content: { [key in ArticleLanguage]?: string };
    imageUrl: string;
    metadata: {
        category: ArticleCategory;
        dateModified: string;
        datePublished: string;
        description: Record<ArticleLanguage, string>;
        series?: string;
        title: Record<ArticleLanguage, string>;
    };
    publicIndex: number;
    published: boolean;
};

// Private sanitization helpers

function sanitizeEmDashes(text: string): string {
    if (!text) return text;
    // Replace various dash characters (em dash, en dash, horizontal bar, figure dash) with commas
    // Covers: U+2014 (—), U+2013 (–), U+2015 (―), U+2012 (‒)
    return text.replace(/\s*[—–―‒]\s*/g, ', ');
}

function capitalizeFirst(title: string): string {
    if (!title) return title;

    const segments = title.split(':');

    return segments
        .map((segment, index) => {
            const trimmed = segment.trim();
            if (!trimmed) return segment;

            const leadingSpace = index > 0 && segment.startsWith(' ') ? ' ' : '';
            // Only capitalize first letter, preserve rest as-is (keeps "AI", proper nouns, etc.)
            const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

            return leadingSpace + capitalized;
        })
        .join(':');
}

function sanitizeTitle(title: string): string {
    if (!title) return title;
    return sanitizeEmDashes(capitalizeFirst(title));
}

function sanitizeMarkdownHeadings(content: string): string {
    if (!content) return content;
    // Match markdown headings: # at start of line, followed by space and title text
    return content.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, title) => {
        return `${hashes} ${capitalizeFirst(title)}`;
    });
}

function sanitizeContent(content: string): string {
    if (!content) return content;
    const withSanitizedHeadings = sanitizeMarkdownHeadings(content);
    return sanitizeEmDashes(withSanitizedHeadings);
}

function sanitizeTranslatedText(
    record: Record<ArticleLanguage, string>,
): Record<ArticleLanguage, string> {
    return {
        en: sanitizeContent(record.en),
        fr: sanitizeContent(record.fr),
    };
}

function sanitizeTranslatedTitle(
    record: Record<ArticleLanguage, string>,
): Record<ArticleLanguage, string> {
    return {
        en: sanitizeTitle(record.en),
        fr: sanitizeTitle(record.fr),
    };
}

/**
 * Factory function to create a valid Article from raw input.
 * Applies domain-specific sanitization rules:
 * - Titles: sentence case + em dash replacement
 * - Content/descriptions: em dash replacement
 */
export function createArticle(raw: RawArticleInput): Article {
    return {
        content: {
            en: raw.content.en ? sanitizeContent(raw.content.en) : undefined,
            fr: raw.content.fr ? sanitizeContent(raw.content.fr) : undefined,
        },
        imageUrl: raw.imageUrl,
        metadata: {
            category: raw.metadata.category,
            dateModified: raw.metadata.dateModified,
            datePublished: raw.metadata.datePublished,
            description: sanitizeTranslatedText(raw.metadata.description),
            series: raw.metadata.series,
            title: sanitizeTranslatedTitle(raw.metadata.title),
        },
        publicIndex: raw.publicIndex,
        published: raw.published,
    };
}

// Exported for testing only
export const __test__ = {
    capitalizeFirst,
    sanitizeContent,
    sanitizeEmDashes,
    sanitizeMarkdownHeadings,
    sanitizeTitle,
};
