import { describe, expect, it } from '@jterrazz/test';
import { replaceEmDashes, sanitizeTitle, toSentenceCase } from '../sanitize-title';

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

describe('replaceEmDashes', () => {
    it('should replace em dash with comma and space', () => {
        expect(replaceEmDashes('Hello—World')).toBe('Hello, World');
    });

    it('should replace multiple em dashes', () => {
        expect(replaceEmDashes('One—Two—Three')).toBe('One, Two, Three');
    });

    it('should handle text without em dashes', () => {
        expect(replaceEmDashes('No dashes here')).toBe('No dashes here');
    });

    it('should handle empty string', () => {
        expect(replaceEmDashes('')).toBe('');
    });

    it('should not replace regular hyphens', () => {
        expect(replaceEmDashes('well-known')).toBe('well-known');
    });

    it('should not replace en dashes', () => {
        expect(replaceEmDashes('2020–2024')).toBe('2020–2024');
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
