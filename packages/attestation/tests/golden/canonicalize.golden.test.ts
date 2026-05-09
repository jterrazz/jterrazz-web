import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { canonicalize } from '../../src/core/canonicalize.js';

/**
 * Frozen byte-and-digest goldens for canonicalize() v1.
 *
 * These snapshots are part of the canonicalization v1 contract. If a snapshot
 * changes, EVERY past attestation signed against v1 becomes unverifiable.
 *
 * Update only by introducing CANONICAL_VERSION=2 alongside, never by overwriting.
 */

type Fixture = { name: string; input: string };

const fixtures: Fixture[] = [
    { input: '', name: '01-empty' },
    { input: '# Hello\n\nWorld.', name: '02-plain-ascii' },
    { input: 'Hello 🦊 fox', name: '03-emoji-4byte-utf8' },
    { input: 'café', name: '04-combining-diacritics-decomposed' },
    { input: 'café', name: '05-combining-diacritics-precomposed' },
    { input: 'a\r\nb\r\nc', name: '06-crlf-line-endings' },
    { input: 'a\rb\rc', name: '07-cr-only-line-endings' },
    { input: '﻿hello', name: '08-bom-prefix' },
    { input: '```\n    indented\n\tcode\n```', name: '09-code-block-indentation' },
    { input: 'line1  \nline2', name: '10-soft-line-break-preserved' },
    { input: 'abc   \t  ', name: '11-trailing-whitespace-no-newline' },
    { input: 'abc\n\n\n\n', name: '12-multiple-trailing-newlines' },
    { input: '日本語\n中文\n한국어', name: '13-cjk-text' },
    { input: 'מימין לשמאל', name: '14-rtl-hebrew' },
];

const sha256Hex = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

describe('canonicalize golden — v1 frozen outputs', () => {
    it.each(fixtures)('$name → frozen bytes + digest', ({ input }) => {
        const bytes = canonicalize(input);
        const utf8 = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        const digest = sha256Hex(bytes);

        expect({
            byteLength: bytes.length,
            digest,
            utf8,
        }).toMatchSnapshot();
    });

    it('NFC equivalence: decomposed and precomposed produce identical bytes', () => {
        // Two fixtures above represent the same Unicode glyph in different forms.
        const decomposed = canonicalize('café');
        const precomposed = canonicalize('café');
        expect(decomposed).toEqual(precomposed);
    });
});
