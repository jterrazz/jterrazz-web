import { describe, expect, it } from 'vitest';

import { canonicalize, InvalidContentError } from './canonicalize.js';

const decode = (bytes: Uint8Array): string =>
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);

describe('canonicalize — rule by rule', () => {
    describe('rule 1 — invalid UTF-16 rejected', () => {
        it('rejects an unpaired high surrogate', () => {
            const bad = `before${String.fromCharCode(0xd83d)}after`;
            expect(() => canonicalize(bad)).toThrow(InvalidContentError);
        });

        it('rejects an unpaired low surrogate', () => {
            const bad = `before${String.fromCharCode(0xdc00)}after`;
            expect(() => canonicalize(bad)).toThrow(InvalidContentError);
        });

        it('accepts valid surrogate pairs (emoji)', () => {
            expect(() => canonicalize('hello 🦊 fox')).not.toThrow();
        });
    });

    describe('rule 2 — BOM stripping', () => {
        it('strips a leading BOM', () => {
            expect(decode(canonicalize('﻿hello'))).toBe('hello\n');
        });

        it('keeps a BOM in the middle (not at start)', () => {
            expect(decode(canonicalize('a﻿b'))).toBe('a﻿b\n');
        });
    });

    describe('rule 3 — Unicode NFC', () => {
        it('normalizes "café" with combining acute to NFC', () => {
            const decomposed = 'café';
            const composed = 'café';
            expect(canonicalize(decomposed)).toEqual(canonicalize(composed));
        });

        it('NFC output round-trips identically', () => {
            const out = canonicalize('café');
            expect(canonicalize(decode(out).slice(0, -1))).toEqual(out);
        });
    });

    describe('rule 4 — line endings to LF', () => {
        it('converts CRLF to LF', () => {
            expect(decode(canonicalize('a\r\nb\r\nc'))).toBe('a\nb\nc\n');
        });

        it('converts lone CR to LF', () => {
            expect(decode(canonicalize('a\rb\rc'))).toBe('a\nb\nc\n');
        });

        it('handles mixed CRLF / CR / LF in same input', () => {
            expect(decode(canonicalize('a\r\nb\rc\nd'))).toBe('a\nb\nc\nd\n');
        });
    });

    describe('rule 5 — trailing whitespace and single trailing LF', () => {
        it('appends a trailing LF when missing', () => {
            expect(decode(canonicalize('abc'))).toBe('abc\n');
        });

        it('collapses multiple trailing LFs to one', () => {
            expect(decode(canonicalize('abc\n\n\n'))).toBe('abc\n');
        });

        it('strips trailing spaces and tabs before appending LF', () => {
            expect(decode(canonicalize('abc   \t  '))).toBe('abc\n');
        });

        it(String.raw`preserves "  \n" markdown soft-break in the middle`, () => {
            // Markdown soft break: two trailing spaces before \n.
            // Should NOT be touched mid-document.
            expect(decode(canonicalize('line1  \nline2'))).toBe('line1  \nline2\n');
        });

        it('preserves leading whitespace on indented code blocks', () => {
            const input = '```\n    indented\n\tcode\n```';
            expect(decode(canonicalize(input))).toBe('```\n    indented\n\tcode\n```\n');
        });
    });

    describe('rule 6 — UTF-8 encoding', () => {
        it('encodes 4-byte emoji correctly', () => {
            const bytes = canonicalize('🦊');
            // Fox emoji U+1F98A is F0 9F A6 8A in UTF-8, plus trailing 0A.
            expect([...bytes]).toEqual([0xf0, 0x9f, 0xa6, 0x8a, 0x0a]);
        });

        it('encodes 3-byte CJK correctly', () => {
            const bytes = canonicalize('日');
            // 日 U+65E5 is E6 97 A5 in UTF-8, plus trailing 0A.
            expect([...bytes]).toEqual([0xe6, 0x97, 0xa5, 0x0a]);
        });
    });

    describe('determinism', () => {
        it('produces identical bytes across repeated calls', () => {
            const input = '# Hello\n\nWorld 🌍\nLine with **bold**.\n';
            const a = canonicalize(input);
            const b = canonicalize(input);
            expect(a).toEqual(b);
        });

        it('handles the empty string', () => {
            expect(decode(canonicalize(''))).toBe('\n');
        });

        it('handles a string of only whitespace', () => {
            expect(decode(canonicalize('   \n\t\n  '))).toBe('\n');
        });
    });
});
