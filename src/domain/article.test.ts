import { describe, expect, test } from 'vitest';

import { __test__, ArticleCategory, createArticle, type RawArticleInput } from './article';

const { capitalizeFirst, sanitizeEmDashes, sanitizeTitle, sanitizeContent } = __test__;

describe('capitalizeFirst', () => {
    test('should capitalize first letter and preserve rest', () => {
        // Given — a string starting with a lowercase letter
        const input = 'a guide to the AI revolution';

        // Then — the first letter is capitalized
        expect(capitalizeFirst(input)).toBe('A guide to the AI revolution');
    });

    test('should preserve capitalization after colon', () => {
        // Given — a string with a colon separating two parts
        const input = 'cursor: The Compression Of Mechanical Work';

        // Then — the first letter of each colon-separated part is capitalized
        expect(capitalizeFirst(input)).toBe('Cursor: The Compression Of Mechanical Work');
    });

    test('should handle multiple colons', () => {
        // Given — a string with multiple colons
        const input = 'first Part: Second Part: Third Part';

        // Then — each colon-separated part gets its first letter capitalized
        expect(capitalizeFirst(input)).toBe('First Part: Second Part: Third Part');
    });

    test('should handle single word', () => {
        // Given — a single lowercase word
        const input = 'hello';

        // Then — the word is capitalized
        expect(capitalizeFirst(input)).toBe('Hello');
    });

    test('should handle empty string', () => {
        // Given — an empty string
        const input = '';

        // Then — an empty string is returned
        expect(capitalizeFirst(input)).toBe('');
    });

    test('should handle already capitalized text', () => {
        // Given — a string that is already capitalized
        const input = 'Already Capitalized';

        // Then — the string is unchanged
        expect(capitalizeFirst(input)).toBe('Already Capitalized');
    });

    test('should preserve acronyms like AI', () => {
        // Given — a string containing an acronym
        const input = 'the AI revolution';

        // Then — the acronym is preserved and first letter is capitalized
        expect(capitalizeFirst(input)).toBe('The AI revolution');
    });

    test('should handle colon at end', () => {
        // Given — a string ending with a colon
        const input = 'a title:';

        // Then — the first letter is capitalized and trailing colon is preserved
        expect(capitalizeFirst(input)).toBe('A title:');
    });
});

describe('sanitizeEmDashes', () => {
    test('should replace em dash with comma and space', () => {
        // Given — a string with an em dash
        const input = 'Hello—World';

        // Then — the em dash is replaced with comma and space
        expect(sanitizeEmDashes(input)).toBe('Hello, World');
    });

    test('should replace multiple em dashes', () => {
        // Given — a string with multiple em dashes
        const input = 'One—Two—Three';

        // Then — all em dashes are replaced
        expect(sanitizeEmDashes(input)).toBe('One, Two, Three');
    });

    test('should handle text without em dashes', () => {
        // Given — a string without any dashes
        const input = 'No dashes here';

        // Then — the string is unchanged
        expect(sanitizeEmDashes(input)).toBe('No dashes here');
    });

    test('should handle empty string', () => {
        // Given — an empty string
        const input = '';

        // Then — an empty string is returned
        expect(sanitizeEmDashes(input)).toBe('');
    });

    test('should not replace regular hyphens', () => {
        // Given — a string with a regular hyphen
        const input = 'well-known';

        // Then — the hyphen is preserved
        expect(sanitizeEmDashes(input)).toBe('well-known');
    });

    test('should also replace en dashes', () => {
        // Given — a string with an en dash
        const input = '2020–2024';

        // Then — the en dash is replaced with comma and space
        expect(sanitizeEmDashes(input)).toBe('2020, 2024');
    });

    test('should handle dashes with surrounding whitespace', () => {
        // Given — strings with dashes surrounded by whitespace
        const emDashInput = 'word — word';
        const enDashInput = 'word – word';

        // Then — the whitespace and dash are replaced with comma and space
        expect(sanitizeEmDashes(emDashInput)).toBe('word, word');
        expect(sanitizeEmDashes(enDashInput)).toBe('word, word');
    });
});

describe('sanitizeTitle', () => {
    test('should apply capitalize first and em dash replacement', () => {
        // Given — a title with em dash and lowercase first letter
        const input = 'a Super—Title';

        // Then — the title is capitalized and em dash is replaced
        expect(sanitizeTitle(input)).toBe('A Super, Title');
    });

    test('should handle title with colon and em dash', () => {
        // Given — a title with both colons and em dashes
        const input = 'part One—Intro: part Two—Details';

        // Then — both transformations are applied
        expect(sanitizeTitle(input)).toBe('Part One, Intro: Part Two, Details');
    });

    test('should handle empty string', () => {
        // Given — an empty string
        const input = '';

        // Then — an empty string is returned
        expect(sanitizeTitle(input)).toBe('');
    });

    test('should preserve AI and other acronyms', () => {
        // Given — a title containing an acronym
        const input = 'a guide to the AI revolution';

        // Then — the acronym is preserved
        expect(sanitizeTitle(input)).toBe('A guide to the AI revolution');
    });
});

describe('sanitizeContent', () => {
    test('should replace em dashes in content', () => {
        // Given — content with em dashes
        const input = 'This is—content with—dashes';

        // Then — em dashes are replaced
        expect(sanitizeContent(input)).toBe('This is, content with, dashes');
    });

    test('should not apply sentence case', () => {
        // Given — content in title case
        const input = 'This Is Title Case Content';

        // Then — the casing is preserved
        expect(sanitizeContent(input)).toBe('This Is Title Case Content');
    });

    test('should handle empty string', () => {
        // Given — an empty string
        const input = '';

        // Then — an empty string is returned
        expect(sanitizeContent(input)).toBe('');
    });
});

describe('createArticle', () => {
    const baseInput: RawArticleInput = {
        content: {
            en: 'Some content—with dashes',
            fr: 'Du contenu—avec tirets',
        },
        imageUrl: '/image.jpg',
        metadata: {
            category: ArticleCategory.Reflection,
            dateModified: '2024-01-01',
            datePublished: '2024-01-01',
            description: {
                en: 'A Description—Here',
                fr: 'Une Description—Ici',
            },
            tagline: {
                en: 'A Tagline—Here',
                fr: 'Un Slogan—Ici',
            },
            title: {
                en: 'A Super Title—Here',
                fr: 'Un Super Titre—Ici',
            },
        },
        publicIndex: 1,
        published: true,
    };

    test('should sanitize titles with capitalize first and em dash replacement', () => {
        // Given — article input with em dashes in titles
        const article = createArticle(baseInput);

        // Then — titles are sanitized
        expect(article.metadata.title.en).toBe('A Super Title, Here');
        expect(article.metadata.title.fr).toBe('Un Super Titre, Ici');
    });

    test('should sanitize descriptions with em dash replacement only', () => {
        // Given — article input with em dashes in descriptions
        const article = createArticle(baseInput);

        // Then — descriptions have em dashes replaced
        expect(article.metadata.description.en).toBe('A Description, Here');
        expect(article.metadata.description.fr).toBe('Une Description, Ici');
    });

    test('should sanitize content with em dash replacement only', () => {
        // Given — article input with em dashes in content
        const article = createArticle(baseInput);

        // Then — content has em dashes replaced
        expect(article.content.en).toBe('Some content, with dashes');
        expect(article.content.fr).toBe('Du contenu, avec tirets');
    });

    test('should preserve other fields unchanged', () => {
        // Given — article input with various fields
        const article = createArticle(baseInput);

        // Then — non-text fields are preserved as-is
        expect(article.imageUrl).toBe('/image.jpg');
        expect(article.publicIndex).toBe(1);
        expect(article.published).toBe(true);
        expect(article.metadata.category).toBe(ArticleCategory.Reflection);
    });

    test('should preserve AI and other acronyms in titles', () => {
        // Given — article input with acronyms in titles
        const input: RawArticleInput = {
            ...baseInput,
            metadata: {
                ...baseInput.metadata,
                title: {
                    en: 'A guide to the AI revolution',
                    fr: 'Guide de la révolution IA',
                },
            },
        };
        const article = createArticle(input);

        // Then — acronyms are preserved in sanitized titles
        expect(article.metadata.title.en).toBe('A guide to the AI revolution');
        expect(article.metadata.title.fr).toBe('Guide de la révolution IA');
    });
});
