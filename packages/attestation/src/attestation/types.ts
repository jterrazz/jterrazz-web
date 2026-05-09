import { type AttestationMessage } from '../core/eip712-schema.js';

export type SignedAttestation = AttestationMessage & {
    signature: `0x${string}`;
    signerAddress: `0x${string}`;
};

/**
 * On-disk shape (JSON-safe). `publishedAt` is stringified because JSON has no
 * native bigint. Parse / stringify helpers in serialize.ts.
 */
export type StoredAttestation = {
    schemaVersion: number;
    subject: {
        title: string;
        contentDigest: `0x${string}`;
        locale: string;
    };
    claims: {
        slug: string;
        publishedAt: string;
        revision: number;
        priorAttestation: `0x${string}`;
    };
    signature: `0x${string}`;
    signerAddress: `0x${string}`;
};

export type VerifyOk = {
    ok: true;
    signerAddress: `0x${string}`;
};

export type VerifyError =
    | { kind: 'content-mismatch'; expectedDigest: `0x${string}`; actualDigest: `0x${string}` }
    | { kind: 'invalid-signature'; reason: string }
    | { kind: 'schema-version-unsupported'; version: number }
    | { kind: 'signer-mismatch'; recovered: `0x${string}`; declared: `0x${string}` };

export type VerifyFail = {
    ok: false;
    error: VerifyError;
};

export type VerifyResult = VerifyFail | VerifyOk;
