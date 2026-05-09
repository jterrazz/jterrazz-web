/**
 * Suspicious-character audit — runs at SIGN time, never at verify time.
 *
 * Verify must always remain a function of canonicalize() alone, never adding
 * stricter rules. Audit is a separate, mutable layer of advice for the author:
 * "you probably don't want these invisible chars in a published article".
 */

const SUSPICIOUS: ReadonlyMap<number, string> = new Map([
    [0x20_0b, 'zero-width space'],
    [0x200c, 'zero-width non-joiner'],
    [0x200d, 'zero-width joiner'],
    [0x20_60, 'word joiner'],
    [0xfeff, 'zero-width no-break space (interior BOM)'],
    [0x20_2a, 'left-to-right embedding'],
    [0x202b, 'right-to-left embedding'],
    [0x202c, 'pop directional formatting'],
    [0x202d, 'left-to-right override'],
    [0x202e, 'right-to-left override'],
    [0x20_66, 'left-to-right isolate'],
    [0x20_67, 'right-to-left isolate'],
    [0x20_68, 'first strong isolate'],
    [0x20_69, 'pop directional isolate'],
]);

export type AuditFinding = {
    line: number;
    column: number;
    codepoint: number;
    name: string;
};

export function audit(canonical: Uint8Array): AuditFinding[] {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(canonical);
    const findings: AuditFinding[] = [];
    let line = 1;
    let column = 1;

    for (const ch of text) {
        const cp = ch.codePointAt(0);
        if (cp === undefined) {
            continue;
        }
        if (cp === 0x0a) {
            line++;
            column = 1;
            continue;
        }
        const name = SUSPICIOUS.get(cp);
        if (name !== undefined) {
            findings.push({ codepoint: cp, column, line, name });
        }
        column++;
    }

    return findings;
}
