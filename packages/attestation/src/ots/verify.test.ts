import { describe, expect, it } from 'vitest';

import { verifyOts } from './verify.js';

describe('verifyOts — input validation', () => {
    it('rejects a non-32-byte digest', async () => {
        const result = await verifyOts(new Uint8Array(31), new Uint8Array(0));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.reason).toBe('digest-mismatch');
        }
    });

    it('rejects garbage proof bytes', async () => {
        const validDigest = new Uint8Array(32);
        const garbage = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
        const result = await verifyOts(validDigest, garbage);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.reason).toBe('invalid-proof');
        }
    });
});
