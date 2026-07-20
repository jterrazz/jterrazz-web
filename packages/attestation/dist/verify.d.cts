import { o as AttestationMessage } from "./eip712-schema.cjs";
import { LocalAccount } from "viem";
//#region src/core/canonicalize.d.ts
/**
 * Canonicalize an article body for attestation v1.
 *
 * FROZEN CONTRACT — v1 rules below must NEVER change. Any modification requires
 * publishing a v2 alongside (and v1 verifiers stay alive forever).
 *
 * Rules applied in order:
 *  1. Reject unpaired UTF-16 surrogates (corrupt input).
 *  2. Strip a leading BOM (U+FEFF) if present.
 *  3. Apply Unicode NFC normalization.
 *  4. Convert CRLF and stray CR to LF.
 *  5. Trim trailing whitespace and append exactly one LF.
 *  6. Encode as UTF-8 bytes.
 *
 * No markdown parsing. No per-line whitespace trim (would break "  \n" soft breaks).
 * No tab → space substitution (would break code blocks).
 * No interior whitespace collapsing.
 */
declare function canonicalize(input: string): Uint8Array;
declare class InvalidContentError extends Error {
  name: string;
}
//#endregion
//#region src/attestation/types.d.ts
type SignedAttestation = AttestationMessage & {
  signature: `0x${string}`;
  signerAddress: `0x${string}`;
};
/**
 * On-disk shape (JSON-safe). `publishedAt` is stringified because JSON has no
 * native bigint. Parse / stringify helpers in serialize.ts.
 */
type StoredAttestation = {
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
type VerifyOk = {
  ok: true;
  signerAddress: `0x${string}`;
};
type VerifyError = {
  kind: 'content-mismatch';
  expectedDigest: `0x${string}`;
  actualDigest: `0x${string}`;
} | {
  kind: 'invalid-signature';
  reason: string;
} | {
  kind: 'schema-version-unsupported';
  version: number;
} | {
  kind: 'signer-mismatch';
  recovered: `0x${string}`;
  declared: `0x${string}`;
};
type VerifyFail = {
  ok: false;
  error: VerifyError;
};
type VerifyResult = VerifyFail | VerifyOk;
//#endregion
//#region src/attestation/create.d.ts
type CreateAttestationInput = {
  content: string;
  title: string;
  slug: string;
  locale: string;
  publishedAt: bigint | Date | number;
  revision?: number;
  priorAttestation?: `0x${string}`;
};
declare function buildAttestationMessage(input: CreateAttestationInput): AttestationMessage;
declare function signAttestation(message: AttestationMessage, account: LocalAccount): Promise<SignedAttestation>;
declare function createAttestation(input: CreateAttestationInput, account: LocalAccount): Promise<SignedAttestation>;
//#endregion
//#region src/attestation/serialize.d.ts
declare function toStored(att: SignedAttestation): StoredAttestation;
declare function fromStored(stored: StoredAttestation): SignedAttestation;
declare function stringify(att: SignedAttestation): string;
declare function parse(json: string): SignedAttestation;
//#endregion
//#region src/attestation/verify.d.ts
type VerifyInput = {
  content: string;
  attestation: SignedAttestation;
};
declare function verifyAttestation(input: VerifyInput): Promise<VerifyResult>;
//#endregion
export { InvalidContentError as _, stringify as a, buildAttestationMessage as c, SignedAttestation as d, StoredAttestation as f, VerifyResult as g, VerifyOk as h, parse as i, createAttestation as l, VerifyFail as m, verifyAttestation as n, toStored as o, VerifyError as p, fromStored as r, CreateAttestationInput as s, VerifyInput as t, signAttestation as u, canonicalize as v };
//# sourceMappingURL=verify.d.cts.map