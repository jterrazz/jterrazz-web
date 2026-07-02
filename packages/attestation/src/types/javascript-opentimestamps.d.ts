declare module 'javascript-opentimestamps' {
    const lib: {
        DetachedTimestampFile: {
            deserialize: (bytes: Buffer | Uint8Array) => unknown;
            fromHash: (op: unknown, hash: Buffer) => unknown;
        };
        Ops: { OpSHA256: unknown };
        stamp: (detached: unknown) => Promise<void>;
        upgrade: (detached: unknown) => Promise<boolean>;
        verify: (
            detached: unknown,
            original: unknown,
        ) => Promise<Record<string, { timestamp: number }>>;
    };
    export default lib;
}
