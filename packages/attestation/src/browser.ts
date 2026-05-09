// Browser-safe entry. Pure ESM, no Node-only imports (fs, http, crypto…).
// All primitives go through @noble/hashes and viem, both of which run in any
// Modern JS runtime (browsers, Node, Bun, Deno, Edge).

export { canonicalize, InvalidContentError } from './core/canonicalize.js';
export { sha256Hex } from './core/sha256.js';
export {
    type ArticleClaims,
    type ArticleSubject,
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
    NO_PRIOR_ATTESTATION,
} from './core/eip712-schema.js';

export { buildAttestationMessage, type CreateAttestationInput } from './attestation/create.js';
export { fromStored, parse, stringify, toStored } from './attestation/serialize.js';
export {
    type SignedAttestation,
    type StoredAttestation,
    type VerifyError,
    type VerifyFail,
    type VerifyOk,
    type VerifyResult,
} from './attestation/types.js';
export { verifyAttestation, type VerifyInput } from './attestation/verify.js';

export { resolveEnsName } from './browser/ens.js';
export { type AuthorshipState, type DateState, type ProofManifest } from './browser/types.js';
export {
    verifyFromUrl,
    type VerifyFromUrlOptions,
    type VerifyFromUrlReport,
} from './browser/verify-from-url.js';
