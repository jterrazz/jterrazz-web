/* ANSI helpers — kept tiny so we don't pull in chalk. */

const supportsColor = process.stdout.isTTY === true && !process.env.NO_COLOR;

export const fmt = {
    bold: (s: string) => (supportsColor ? `\x1b[1m${s}\x1b[0m` : s),
    dim: (s: string) => (supportsColor ? `\x1b[2m${s}\x1b[0m` : s),
    fail: (s: string) => (supportsColor ? `\x1b[31m${s}\x1b[0m` : s),
    info: (s: string) => (supportsColor ? `\x1b[36m${s}\x1b[0m` : s),
    ok: (s: string) => (supportsColor ? `\x1b[32m${s}\x1b[0m` : s),
    warn: (s: string) => (supportsColor ? `\x1b[33m${s}\x1b[0m` : s),
};

export function checkmark(): string {
    return fmt.ok('✓');
}

export function crossmark(): string {
    return fmt.fail('✗');
}
