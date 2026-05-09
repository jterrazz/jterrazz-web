import { type SignedAttestation, type VerifyError } from '../attestation/types.js';

export type ProofManifest = {
    schemaVersion: number;
    slug: string;
    content: string;
    attestation: string;
    ots: string;
    /**
     * Optional URL of a server-side OTS verifier. The browser cannot validate
     * OpenTimestamps proofs locally (the lib needs Node `fs` + `crypto`), so
     * publishers expose this endpoint to delegate the Bitcoin check.
     *
     * Returns: { ok: true; bitcoinTime: ISO } | { ok: false; reason; details? }
     */
    otsVerifier?: string;
};

export type AuthorshipState =
    | { kind: 'failed'; error: 'fetch' | VerifyError['kind']; details?: string }
    | { kind: 'fetching' }
    | { kind: 'idle' }
    | {
          kind: 'verified';
          signerAddress: `0x${string}`;
          signerEns?: string;
          signedAt: Date;
      }
    | { kind: 'verifying' };

export type DateState =
    | { kind: 'failed'; error: 'digest-mismatch' | 'fetch' | 'invalid-proof'; details?: string }
    | { kind: 'fetching' }
    | { kind: 'idle' }
    | { kind: 'pending' }
    | { kind: 'skipped'; reason: 'browser-runtime' | 'no-ots-file' | 'opt-out' }
    | { kind: 'verified'; bitcoinTime: Date }
    | { kind: 'verifying' };

export type VerificationResult = {
    authorship: AuthorshipState;
    date: DateState;
    attestation?: SignedAttestation;
};
