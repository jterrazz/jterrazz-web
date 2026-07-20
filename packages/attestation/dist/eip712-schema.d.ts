//#region src/core/eip712-schema.d.ts
/**
 * EIP-712 typed-data schema for attestation v1 — FROZEN.
 *
 * Once a single attestation is published, every byte of this file is part of an
 * immutable contract. Modifying any value below changes the typed-data digest
 * and invalidates every previously signed attestation.
 *
 * To evolve: introduce v2 alongside (`eip712-schema-v2.ts`), bump SCHEMA_VERSION,
 * keep v1 verifier alive forever, dispatch by attestation.schemaVersion.
 */
declare const ATTESTATION_DOMAIN_V1: {
  readonly chainId: 1;
  readonly name: "jterrazz.com Article Attestation";
  readonly version: "1";
};
declare const ATTESTATION_TYPES_V1: {
  readonly Attestation: readonly [{
    readonly name: "schemaVersion";
    readonly type: "uint16";
  }, {
    readonly name: "subject";
    readonly type: "ArticleSubject";
  }, {
    readonly name: "claims";
    readonly type: "ArticleClaims";
  }];
  readonly ArticleClaims: readonly [{
    readonly name: "slug";
    readonly type: "string";
  }, {
    readonly name: "publishedAt";
    readonly type: "uint64";
  }, {
    readonly name: "revision";
    readonly type: "uint16";
  }, {
    readonly name: "priorAttestation";
    readonly type: "bytes32";
  }];
  readonly ArticleSubject: readonly [{
    readonly name: "title";
    readonly type: "string";
  }, {
    readonly name: "contentDigest";
    readonly type: "bytes32";
  }, {
    readonly name: "locale";
    readonly type: "string";
  }];
};
declare const ATTESTATION_PRIMARY_TYPE: "Attestation";
/**
 * Sentinel value for `priorAttestation` when this is the first revision.
 */
declare const NO_PRIOR_ATTESTATION: "0x0000000000000000000000000000000000000000000000000000000000000000";
type ArticleSubject = {
  title: string;
  contentDigest: `0x${string}`;
  locale: string;
};
type ArticleClaims = {
  slug: string;
  publishedAt: bigint;
  revision: number;
  priorAttestation: `0x${string}`;
};
type AttestationMessage = {
  schemaVersion: number;
  subject: ArticleSubject;
  claims: ArticleClaims;
};
//#endregion
export { ArticleSubject as a, ArticleClaims as i, ATTESTATION_PRIMARY_TYPE as n, AttestationMessage as o, ATTESTATION_TYPES_V1 as r, NO_PRIOR_ATTESTATION as s, ATTESTATION_DOMAIN_V1 as t };
//# sourceMappingURL=eip712-schema.d.ts.map