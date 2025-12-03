import { describe, expect, it } from '@jterrazz/test';

import { ArticleCategory, createArticle, type RawArticleInput, __test__ } from '../article';

const { toSentenceCase, sanitizeEmDashes, sanitizeTitle, sanitizeContent } = __test__;

describe('toSentenceCase', () => {
    it('should convert title case to sentence case', () => {
        expect(toSentenceCase('A Super Title')).toBe('A super title');
    });

    it('should preserve capitalization after colon as new sentence', () => {
        expect(toSentenceCase('A Super: Title Of Something')).toBe('A super: Title of something');
    });

    it('should handle multiple colons', () => {
        expect(toSentenceCase('First Part: Second Part: Third Part')).toBe(
            'First part: Second part: Third part',
        );
    });

    it('should handle single word', () => {
        expect(toSentenceCase('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
        expect(toSentenceCase('')).toBe('');
    });

    it('should handle already lowercase text', () => {
        expect(toSentenceCase('already lowercase')).toBe('Already lowercase');
    });

    it('should preserve spacing around colons', () => {
        expect(toSentenceCase('Part One: Part Two')).toBe('Part one: Part two');
    });

    it('should handle colon at end', () => {
        expect(toSentenceCase('A Title:')).toBe('A title:');
    });
});

describe('sanitizeEmDashes', () => {
    it('should replace em dash with comma and space', () => {
        expect(sanitizeEmDashes('Hello—World')).toBe('Hello, World');
    });

    it('should replace multiple em dashes', () => {
        expect(sanitizeEmDashes('One—Two—Three')).toBe('One, Two, Three');
    });

    it('should handle text without em dashes', () => {
        expect(sanitizeEmDashes('No dashes here')).toBe('No dashes here');
    });

    it('should handle empty string', () => {
        expect(sanitizeEmDashes('')).toBe('');
    });

    it('should not replace regular hyphens', () => {
        expect(sanitizeEmDashes('well-known')).toBe('well-known');
    });

    it('should not replace en dashes', () => {
        expect(sanitizeEmDashes('2020–2024')).toBe('2020–2024');
    });
});

describe('sanitizeTitle', () => {
    it('should apply both sentence case and em dash replacement', () => {
        expect(sanitizeTitle('A Super—Title')).toBe('A super, title');
    });

    it('should handle title with colon and em dash', () => {
        expect(sanitizeTitle('Part One—Intro: Part Two—Details')).toBe(
            'Part one, intro: Part two, details',
        );
    });

    it('should handle empty string', () => {
        expect(sanitizeTitle('')).toBe('');
    });

    it('should handle real-world example', () => {
        expect(sanitizeTitle('Cursor: The Compression Of Mechanical Work')).toBe(
            'Cursor: The compression of mechanical work',
        );
    });
});

describe('sanitizeContent', () => {
    it('should replace em dashes in content', () => {
        expect(sanitizeContent('This is—content with—dashes')).toBe(
            'This is, content with, dashes',
        );
    });

    it('should not apply sentence case', () => {
        expect(sanitizeContent('This Is Title Case Content')).toBe('This Is Title Case Content');
    });

    it('should handle empty string', () => {
        expect(sanitizeContent('')).toBe('');
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
            category: ArticleCategory.Insight,
            dateModified: '2024-01-01',
            datePublished: '2024-01-01',
            description: {
                en: 'A Description—Here',
                fr: 'Une Description—Ici',
            },
            title: {
                en: 'A Super Title—Here',
                fr: 'Un Super Titre—Ici',
            },
        },
        publicIndex: 1,
        published: true,
    };

    it('should sanitize titles with sentence case and em dash replacement', () => {
        const article = createArticle(baseInput);
        expect(article.metadata.title.en).toBe('A super title, here');
        expect(article.metadata.title.fr).toBe('Un super titre, ici');
    });

    it('should sanitize descriptions with em dash replacement only', () => {
        const article = createArticle(baseInput);
        expect(article.metadata.description.en).toBe('A Description, Here');
        expect(article.metadata.description.fr).toBe('Une Description, Ici');
    });

    it('should sanitize content with em dash replacement only', () => {
        const article = createArticle(baseInput);
        expect(article.content.en).toBe('Some content, with dashes');
        expect(article.content.fr).toBe('Du contenu, avec tirets');
    });

    it('should preserve other fields unchanged', () => {
        const article = createArticle(baseInput);
        expect(article.imageUrl).toBe('/image.jpg');
        expect(article.publicIndex).toBe(1);
        expect(article.published).toBe(true);
        expect(article.metadata.category).toBe(ArticleCategory.Insight);
    });
});
