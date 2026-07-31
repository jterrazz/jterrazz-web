import { describe, expect, test } from 'vitest';

import {
    calculateReadingTimeMinutes,
    stripArticleMasthead,
    stripLeadingHero,
    stripLeadingTitle,
} from './article-content';

describe('stripLeadingHero', () => {
    test('removes a leading image and returns its source', () => {
        // Given - a source file opening on its thumbnail, the way articles ship
        const { body, heroFromContent } = stripLeadingHero(
            '![](assets/thumbnail.jpg)\n\n# Title\n\nBody',
        );

        // Then - the hero is lifted out and the body starts after it
        expect(heroFromContent).toBe('assets/thumbnail.jpg');
        expect(body).toBe('# Title\n\nBody');
    });

    test('keeps alt text out of the source', () => {
        // Given - a leading image carrying alt text
        const { heroFromContent } = stripLeadingHero('![cover photo](a.png)\nrest');

        // Then - only the path is returned, never the caption
        expect(heroFromContent).toBe('a.png');
    });

    test('leaves content untouched when it does not start with an image', () => {
        // Given - a file opening on its title
        const { body, heroFromContent } = stripLeadingHero('# Title\n\nBody');

        // Then - nothing is claimed and nothing is removed
        expect(heroFromContent).toBeNull();
        expect(body).toBe('# Title\n\nBody');
    });

    test('does not strip an image that appears mid-content', () => {
        // Given - an image the author placed inside the prose
        const input = 'Intro paragraph\n\n![](mid.jpg)';

        // Then - it belongs to the body, not to the masthead
        expect(stripLeadingHero(input).heroFromContent).toBeNull();
    });
});

describe('stripLeadingTitle', () => {
    test('removes a leading h1', () => {
        // Given - a file whose first heading is its title
        // Then - the title goes to the masthead, not the rendered body
        expect(stripLeadingTitle('# Title\n\nBody')).toBe('Body');
    });

    test('does not remove h2 or deeper', () => {
        // Given - a file opening on a section rather than a title
        // Then - section headings are body content and stay
        expect(stripLeadingTitle('## Section\n\nBody')).toBe('## Section\n\nBody');
    });

    test('leaves content without a leading heading untouched', () => {
        // Given - prose with no heading at all
        // Then - there is nothing to lift out
        expect(stripLeadingTitle('Just text')).toBe('Just text');
    });
});

describe('stripArticleMasthead', () => {
    test('removes both the leading image and the title', () => {
        // Given - the shape every published article actually has
        const { body, heroFromContent } = stripArticleMasthead(
            '![](assets/thumbnail.jpg)\n\n# Building software that lasts\n\nFirst paragraph.',
        );

        // Then - the page renders the masthead itself, so the body starts at the prose
        expect(heroFromContent).toBe('assets/thumbnail.jpg');
        expect(body).toBe('First paragraph.');
    });

    test('handles missing image gracefully', () => {
        // Given - an article that ships without a thumbnail
        const { body, heroFromContent } = stripArticleMasthead('# Title\n\nBody');

        // Then - the title is still lifted, and the absent hero is not an error
        expect(heroFromContent).toBeNull();
        expect(body).toBe('Body');
    });
});

describe('calculateReadingTimeMinutes', () => {
    test('returns at least 1 minute for short content', () => {
        // Given - an article shorter than a minute of reading
        // Then - "0 min read" would read as broken, so the floor is 1
        expect(calculateReadingTimeMinutes('a few words')).toBe(1);
    });

    test('rounds up partial minutes', () => {
        // Given - 300 words, a minute and a half at the assumed pace
        const content = Array.from({ length: 300 }, () => 'word').join(' ');

        // Then - rounded up, so the estimate never undersells the commitment
        expect(calculateReadingTimeMinutes(content)).toBe(2);
    });

    test('handles empty content', () => {
        // Given - no content at all
        // Then - the same floor applies rather than a zero or a crash
        expect(calculateReadingTimeMinutes('')).toBe(1);
    });
});
