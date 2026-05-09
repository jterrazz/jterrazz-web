export { CANONICAL_VERSION, SCHEMA_VERSION } from './version.js';

export { audit, type AuditFinding } from './core/audit.js';
export { canonicalize, InvalidContentError } from './core/canonicalize.js';
export {
    type ArticleClaims,
    type ArticleSubject,
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
    NO_PRIOR_ATTESTATION,
} from './core/eip712-schema.js';

export {
    buildAttestationMessage,
    createAttestation,
    type CreateAttestationInput,
    signAttestation,
} from './attestation/create.js';
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
