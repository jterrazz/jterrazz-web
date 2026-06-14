import { describe, expect, test } from 'vitest';

import {
    calculateReadingTimeMinutes,
    stripArticleMasthead,
    stripLeadingHero,
    stripLeadingTitle,
} from './article-content';

describe('stripLeadingHero', () => {
    test('removes a leading image and returns its source', () => {
        const { body, heroFromContent } = stripLeadingHero(
            '![](assets/thumbnail.jpg)\n\n# Title\n\nBody',
        );
        expect(heroFromContent).toBe('assets/thumbnail.jpg');
        expect(body).toBe('# Title\n\nBody');
    });

    test('keeps alt text out of the source', () => {
        const { heroFromContent } = stripLeadingHero('![cover photo](a.png)\nrest');
        expect(heroFromContent).toBe('a.png');
    });

    test('leaves content untouched when it does not start with an image', () => {
        const { body, heroFromContent } = stripLeadingHero('# Title\n\nBody');
        expect(heroFromContent).toBeNull();
        expect(body).toBe('# Title\n\nBody');
    });

    test('does not strip an image that appears mid-content', () => {
        const input = 'Intro paragraph\n\n![](mid.jpg)';
        expect(stripLeadingHero(input).heroFromContent).toBeNull();
    });
});

describe('stripLeadingTitle', () => {
    test('removes a leading h1', () => {
        expect(stripLeadingTitle('# Title\n\nBody')).toBe('Body');
    });

    test('does not remove h2 or deeper', () => {
        expect(stripLeadingTitle('## Section\n\nBody')).toBe('## Section\n\nBody');
    });

    test('leaves content without a leading heading untouched', () => {
        expect(stripLeadingTitle('Just text')).toBe('Just text');
    });
});

describe('stripArticleMasthead', () => {
    test('removes both the leading image and the title', () => {
        const { body, heroFromContent } = stripArticleMasthead(
            '![](assets/thumbnail.jpg)\n\n# Building software that lasts\n\nFirst paragraph.',
        );
        expect(heroFromContent).toBe('assets/thumbnail.jpg');
        expect(body).toBe('First paragraph.');
    });

    test('handles missing image gracefully', () => {
        const { body, heroFromContent } = stripArticleMasthead('# Title\n\nBody');
        expect(heroFromContent).toBeNull();
        expect(body).toBe('Body');
    });
});

describe('calculateReadingTimeMinutes', () => {
    test('returns at least 1 minute for short content', () => {
        expect(calculateReadingTimeMinutes('a few words')).toBe(1);
    });

    test('rounds up partial minutes', () => {
        const content = Array.from({ length: 300 }, () => 'word').join(' ');
        expect(calculateReadingTimeMinutes(content)).toBe(2);
    });

    test('handles empty content', () => {
        expect(calculateReadingTimeMinutes('')).toBe(1);
    });
});
