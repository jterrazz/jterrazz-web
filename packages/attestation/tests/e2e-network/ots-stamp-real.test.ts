import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { stampDigest } from '../../src/ots/stamp.js';
import { verifyOts } from '../../src/ots/verify.js';

/**
 * Live OTS network test. Gated behind ATTEST_E2E_NETWORK=1, run via `make test-network`.
 * Submits a real digest to public OTS calendar servers — should never run in CI.
 */
describe.skipIf(!process.env.ATTEST_E2E_NETWORK)('OTS — live calendar submission', () => {
    it('stamps a unique digest and parses the returned proof', async () => {
        // Use a unique-ish digest so we don't pollute the calendar with duplicates.
        const unique = `attestation-package-test-${Date.now()}-${Math.random()}`;
        const digest = new Uint8Array(createHash('sha256').update(unique).digest());

        const proof = await stampDigest(digest);
        expect(proof.length).toBeGreaterThan(0);

        // Immediately after stamping, the proof has only calendar attestations,
        // No Bitcoin yet. So verifyOts should report 'pending-bitcoin'.
        const result = await verifyOts(digest, proof);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.reason).toBe('pending-bitcoin');
        }
    }, 30_000);
});
