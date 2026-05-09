import { describe, expect, it } from 'vitest';

import { audit } from './audit.js';
import { canonicalize } from './canonicalize.js';

const auditOf = (s: string) => audit(canonicalize(s));

describe('audit — suspicious character detection', () => {
    it('returns no findings for clean ASCII text', () => {
        expect(auditOf('# Article\n\nNormal content.')).toEqual([]);
    });

    it('returns no findings for clean Unicode text', () => {
        expect(auditOf('Café 日本語 🦊 שלום')).toEqual([]);
    });

    it('flags a zero-width space', () => {
        const findings = auditOf('hello​world');
        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({ codepoint: 0x200b, line: 1, name: 'zero-width space' });
    });

    it('flags an RTL override', () => {
        const findings = auditOf('admin‮exe.');
        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({ codepoint: 0x202e, name: 'right-to-left override' });
    });

    it('reports correct line and column', () => {
        const findings = auditOf('line1\nline2 ​ end\nline3');
        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({ codepoint: 0x200b, column: 7, line: 2 });
    });

    it('flags multiple suspicious chars in the same input', () => {
        const findings = auditOf('a​b‮c');
        expect(findings).toHaveLength(2);
        expect(findings.map((f) => f.codepoint)).toEqual([0x200b, 0x202e]);
    });
});
