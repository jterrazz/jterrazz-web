import OpenTimestamps from 'javascript-opentimestamps';

const { DetachedTimestampFile, Ops } = OpenTimestamps as {
    DetachedTimestampFile: {
        deserialize(bytes: Buffer | Uint8Array): unknown;
        fromHash(op: unknown, hash: Buffer): unknown;
    };
    Ops: { OpSHA256: unknown };
    stamp(detached: unknown): Promise<void>;
    upgrade(detached: unknown): Promise<boolean>;
    verify(detached: unknown, original: unknown): Promise<Record<string, { timestamp: number }>>;
};

/**
 * Submit a SHA-256 digest to OpenTimestamps calendars and return the proof bytes.
 *
 * The returned proof initially contains only calendar attestations. Run upgrade()
 * after ~24h to anchor it in a Bitcoin block.
 */
export async function stampDigest(digest: Uint8Array): Promise<Uint8Array> {
    if (digest.length !== 32) {
        throw new Error(`Expected 32-byte SHA-256 digest, got ${digest.length} bytes`);
    }

    const detached = DetachedTimestampFile.fromHash(
        new (Ops.OpSHA256 as new () => unknown)(),
        Buffer.from(digest),
    );
    await (OpenTimestamps as unknown as { stamp(d: unknown): Promise<void> }).stamp(detached);

    const serialize = (detached as { serializeToBytes(): Buffer | Uint8Array }).serializeToBytes;
    const bytes = serialize.call(detached);
    return new Uint8Array(bytes as Buffer);
}

/**
 * Try to upgrade a calendar-only proof to a Bitcoin-anchored proof.
 *
 * Returns the (possibly upgraded) proof bytes plus a flag indicating whether
 * the upgrade actually attached a Bitcoin attestation this time.
 */
export async function upgradeProof(
    otsBytes: Uint8Array,
): Promise<{ bytes: Uint8Array; upgraded: boolean }> {
    const detached = DetachedTimestampFile.deserialize(Buffer.from(otsBytes));
    const upgraded = await (
        OpenTimestamps as unknown as { upgrade(d: unknown): Promise<boolean> }
    ).upgrade(detached);

    const serialize = (detached as { serializeToBytes(): Buffer | Uint8Array }).serializeToBytes;
    const bytes = serialize.call(detached);
    return { bytes: new Uint8Array(bytes as Buffer), upgraded };
}
