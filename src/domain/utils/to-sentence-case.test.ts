import { describe, expect, test } from 'vitest';

import { toSentenceCase } from './to-sentence-case';

describe('toSentenceCase', () => {
    describe('empty / trivial input', () => {
        test('returns empty string as-is', () => {
            expect(toSentenceCase('')).toBe('');
        });

        test('returns single word unchanged (below minWords)', () => {
            expect(toSentenceCase('Worldbuilding')).toBe('Worldbuilding');
        });

        test('returns two-word title unchanged (below minWords)', () => {
            expect(toSentenceCase('Building Software')).toBe('Building Software');
        });
    });

    describe('Title Case detection (does not over-trigger)', () => {
        test('leaves sentence-case strings with one proper noun untouched', () => {
            expect(toSentenceCase('Cursor: the compression of mechanical work')).toBe(
                'Cursor: the compression of mechanical work',
            );
        });

        test('leaves sentence-case strings starting with an acronym untouched', () => {
            expect(toSentenceCase('AI is making us smarter')).toBe('AI is making us smarter');
        });

        test('leaves prose with two proper nouns untouched', () => {
            // "Talking to OpenAI about Claude" — 3 caps / 5 words = 60% (boundary)
            // Use a clearer below-threshold case
            expect(toSentenceCase('I talked to Google last week')).toBe(
                'I talked to Google last week',
            );
        });

        test('triggers on 100% capitalized titles (>= 3 words)', () => {
            expect(toSentenceCase('Your Next AI Skill Is Worldbuilding')).toBe(
                'Your next AI skill is worldbuilding',
            );
        });

        test('triggers on Title Case with one lowercase article', () => {
            expect(toSentenceCase('Two Years of Building Agents')).toBe(
                'Two years of building agents',
            );
        });
    });

    describe('preserved acronyms', () => {
        test('keeps AI uppercase mid-title', () => {
            expect(toSentenceCase('Your Next AI Skill Is Worldbuilding')).toBe(
                'Your next AI skill is worldbuilding',
            );
        });

        test('keeps multiple acronyms uppercase', () => {
            expect(toSentenceCase('How To Use The API For HTTP Calls')).toBe(
                'How to use the API for HTTP calls',
            );
        });

        test('preserves CLI and MCP', () => {
            expect(toSentenceCase('A Tour Of CLI And MCP Workflows')).toBe(
                'A tour of CLI and MCP workflows',
            );
        });

        test('preserves mixed-case acronym OAuth from the default list', () => {
            expect(toSentenceCase('The OAuth Spec Is Confusing')).toBe(
                'The OAuth spec is confusing',
            );
        });
    });

    describe('preserved proper nouns from default list', () => {
        test('keeps OpenAI casing', () => {
            expect(toSentenceCase('The OpenAI Revolution Is Here')).toBe(
                'The OpenAI revolution is here',
            );
        });

        test('keeps ChatGPT casing', () => {
            expect(toSentenceCase('Why ChatGPT Changed Everything')).toBe(
                'Why ChatGPT changed everything',
            );
        });

        test('keeps Google casing', () => {
            expect(toSentenceCase('Google Released Another Model')).toBe(
                'Google released another model',
            );
        });

        test('keeps TypeScript casing', () => {
            expect(toSentenceCase('Building With TypeScript And React')).toBe(
                'Building with TypeScript and React',
            );
        });
    });

    describe('first-word handling', () => {
        test('capitalizes first word of input', () => {
            expect(toSentenceCase('your next AI skill is Worldbuilding')).toBe(
                'your next AI skill is Worldbuilding',
            );
            // Above is sentence-case-ish (2/6 caps), not triggered. Verify trigger case:
            expect(toSentenceCase('YOUR NEXT AI SKILL IS WORLDBUILDING')).toBe(
                'Your next AI skill is worldbuilding',
            );
        });

        test('handles single-letter pronoun I mid-title', () => {
            expect(toSentenceCase('Things I Like About Markdown')).toBe(
                'Things I like about markdown',
            );
        });

        test('keeps I capitalized as first word', () => {
            expect(toSentenceCase('I Built A Thing')).toBe('I built a thing');
        });
    });

    describe('sentence boundaries', () => {
        test('capitalizes word after period', () => {
            expect(toSentenceCase('First Half. Second Half Continues')).toBe(
                'First half. Second half continues',
            );
        });

        test('capitalizes word after question mark', () => {
            expect(toSentenceCase('What Now? Find Out Below')).toBe('What now? Find out below');
        });

        test('capitalizes word after exclamation', () => {
            expect(toSentenceCase('Big News! Read This Carefully')).toBe(
                'Big news! Read this carefully',
            );
        });
    });

    describe('mixed-case (camelCase / PascalCase with inner caps)', () => {
        test('preserves arbitrary mixed-case tokens not in the default list', () => {
            // "MyBrandName" has internal caps, should be preserved
            expect(toSentenceCase('Welcome To MyBrandName Today')).toBe(
                'Welcome to MyBrandName today',
            );
        });

        test('preserves iPhone-style casing', () => {
            expect(toSentenceCase('The iPhone Changed Everything')).toBe(
                'The iPhone changed everything',
            );
        });
    });

    describe('punctuation and contractions', () => {
        test('keeps contractions intact', () => {
            expect(toSentenceCase("It's A Beautiful Day")).toBe("It's a beautiful day");
        });

        test('handles colon-separated title segments', () => {
            /*
             * "Cursor: The Compression Of Mechanical Work" — the second clause
             * is Title Case; normalize it but preserve Cursor.
             */
            expect(toSentenceCase('Cursor: The Compression Of Mechanical Work')).toBe(
                'Cursor: the compression of mechanical work',
            );
        });

        test('handles hyphenated compound words by splitting on the hyphen', () => {
            // "AI-Powered World" -> "AI-powered world"
            expect(toSentenceCase('An AI-Powered World Awaits')).toBe('An AI-powered world awaits');
        });
    });

    describe('options', () => {
        test('accepts extra preserved terms', () => {
            expect(
                toSentenceCase('The Acme Foo Bar Baz Is Released', {
                    preservedTerms: ['Acme'],
                }),
            ).toBe('The Acme foo bar baz is released');
        });

        test('replacePreserved drops the default explicit list but the generic acronym pattern still preserves short ALL-CAPS tokens', () => {
            /*
             * "AI" survives via the generic acronym pattern even with the
             * explicit list cleared; only `preservedTerms` is replaced.
             */
            expect(
                toSentenceCase('Your Next AI Skill Is Worldbuilding', {
                    preservedTerms: [],
                    replacePreserved: true,
                }),
            ).toBe('Your next AI skill is worldbuilding');
            // "OpenAI" no longer matches the default list, has internal lower→upper
            // (preserved via the mixed-case rule), so it still stays intact.
            expect(
                toSentenceCase('The OpenAI Revolution Begins', {
                    preservedTerms: [],
                    replacePreserved: true,
                }),
            ).toBe('The OpenAI revolution begins');
        });

        test('lower threshold normalizes mixed-ratio strings', () => {
            // 3/6 = 50% — below default 0.6, above 0.4
            const input = 'Some Words Are Capitalized but others not';
            expect(toSentenceCase(input)).toBe(input);
            expect(toSentenceCase(input, { titleCaseThreshold: 0.4 })).toBe(
                'Some words are capitalized but others not',
            );
        });

        test('higher minWords skips short titles', () => {
            // 4 words, would normally trigger
            expect(toSentenceCase('Hello World And You', { minWords: 5 })).toBe(
                'Hello World And You',
            );
        });
    });

    describe('real article titles from the corpus', () => {
        test('leaves "Mapping the noise" unchanged', () => {
            expect(toSentenceCase('Mapping the noise')).toBe('Mapping the noise');
        });

        test('leaves "The four levels of AI mastery" unchanged', () => {
            expect(toSentenceCase('The four levels of AI mastery')).toBe(
                'The four levels of AI mastery',
            );
        });

        test('leaves "When AI becomes the product" unchanged', () => {
            expect(toSentenceCase('When AI becomes the product')).toBe(
                'When AI becomes the product',
            );
        });

        test('normalizes "Your Next AI Skill Is Worldbuilding"', () => {
            expect(toSentenceCase('Your Next AI Skill Is Worldbuilding')).toBe(
                'Your next AI skill is worldbuilding',
            );
        });
    });
});
