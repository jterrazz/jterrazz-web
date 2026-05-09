import { describe, expect, it } from 'vitest';

import { stampDigest } from './stamp.js';

describe('stampDigest — input validation', () => {
    it('rejects a non-32-byte digest', async () => {
        await expect(stampDigest(new Uint8Array(31))).rejects.toThrow(/32-byte/);
        await expect(stampDigest(new Uint8Array(33))).rejects.toThrow(/32-byte/);
        await expect(stampDigest(new Uint8Array(0))).rejects.toThrow(/32-byte/);
    });
});
