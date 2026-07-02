import OpenTimestamps from 'javascript-opentimestamps';

const { DetachedTimestampFile, Ops } = OpenTimestamps as {
    DetachedTimestampFile: {
        deserialize: (bytes: Buffer | Uint8Array) => unknown;
        fromHash: (op: unknown, hash: Buffer) => unknown;
    };
    Ops: { OpSHA256: unknown };
    verify: (
        detached: unknown,
        original: unknown,
    ) => Promise<Record<string, { timestamp: number }>>;
};

export type OtsVerifyOk = {
    ok: true;
    bitcoinBlockTime: Date;
};

export type OtsVerifyFail = {
    ok: false;
    reason: 'digest-mismatch' | 'invalid-proof' | 'pending-bitcoin';
    details?: string;
};

export type OtsVerifyResult = OtsVerifyFail | OtsVerifyOk;

/**
 * Verify an OTS proof attests the given digest, and return the Bitcoin block
 * attestation time if present.
 *
 * Network: this calls a public Bitcoin block-info source via the OTS library
 * to validate the Merkle path. In production-paranoid mode you should run your
 * own Bitcoin node and pass it explicitly (future enhancement).
 */
export async function verifyOts(
    digest: Uint8Array,
    otsBytes: Uint8Array,
): Promise<OtsVerifyResult> {
    if (digest.length !== 32) {
        return {
            details: `Expected 32-byte digest, got ${digest.length}`,
            ok: false,
            reason: 'digest-mismatch',
        };
    }

    let detached: unknown;
    let original: unknown;
    try {
        detached = DetachedTimestampFile.deserialize(Buffer.from(otsBytes));
        original = DetachedTimestampFile.fromHash(
            new (Ops.OpSHA256 as new () => unknown)(),
            Buffer.from(digest),
        );
    } catch (error) {
        return { details: (error as Error).message, ok: false, reason: 'invalid-proof' };
    }

    let attestations: Record<string, { timestamp: number }>;
    try {
        attestations = await (
            OpenTimestamps as unknown as {
                verify: (
                    detached: unknown,
                    original: unknown,
                ) => Promise<Record<string, { timestamp: number }>>;
            }
        ).verify(detached, original);
    } catch (error) {
        return { details: (error as Error).message, ok: false, reason: 'invalid-proof' };
    }

    const bitcoin = attestations['bitcoin'];
    if (bitcoin === undefined) {
        return { ok: false, reason: 'pending-bitcoin' };
    }

    return {
        bitcoinBlockTime: new Date(bitcoin.timestamp * 1000),
        ok: true,
    };
}
