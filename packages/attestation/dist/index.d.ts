import { _ as InvalidContentError, a as stringify, c as buildAttestationMessage, d as SignedAttestation, f as StoredAttestation, g as VerifyResult, h as VerifyOk, i as parse, l as createAttestation, m as VerifyFail, n as verifyAttestation, o as toStored, p as VerifyError, r as fromStored, s as CreateAttestationInput, t as VerifyInput, u as signAttestation, v as canonicalize } from "./verify.js";
import { a as ArticleSubject, i as ArticleClaims, n as ATTESTATION_PRIMARY_TYPE, o as AttestationMessage, r as ATTESTATION_TYPES_V1, s as NO_PRIOR_ATTESTATION, t as ATTESTATION_DOMAIN_V1 } from "./eip712-schema.js";
//#region src/version.d.ts
declare const SCHEMA_VERSION: 1;
declare const CANONICAL_VERSION: 1;
//#endregion
//#region src/core/audit.d.ts
/**
 * Suspicious-character audit — runs at SIGN time, never at verify time.
 *
 * Verify must always remain a function of canonicalize() alone, never adding
 * stricter rules. Audit is a separate, mutable layer of advice for the author:
 * "you probably don't want these invisible chars in a published article".
 */
type AuditFinding = {
  line: number;
  column: number;
  codepoint: number;
  name: string;
};
declare function audit(canonical: Uint8Array): AuditFinding[];
//#endregion
export { ATTESTATION_DOMAIN_V1, ATTESTATION_PRIMARY_TYPE, ATTESTATION_TYPES_V1, type ArticleClaims, type ArticleSubject, type AttestationMessage, type AuditFinding, CANONICAL_VERSION, type CreateAttestationInput, InvalidContentError, NO_PRIOR_ATTESTATION, SCHEMA_VERSION, type SignedAttestation, type StoredAttestation, type VerifyError, type VerifyFail, type VerifyInput, type VerifyOk, type VerifyResult, audit, buildAttestationMessage, canonicalize, createAttestation, fromStored, parse, signAttestation, stringify, toStored, verifyAttestation };
//# sourceMappingURL=index.d.ts.map