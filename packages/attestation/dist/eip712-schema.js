//#region src/core/eip712-schema.ts
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
const ATTESTATION_DOMAIN_V1 = {
	chainId: 1,
	name: "jterrazz.com Article Attestation",
	version: "1"
};
const ATTESTATION_TYPES_V1 = {
	Attestation: [
		{
			name: "schemaVersion",
			type: "uint16"
		},
		{
			name: "subject",
			type: "ArticleSubject"
		},
		{
			name: "claims",
			type: "ArticleClaims"
		}
	],
	ArticleClaims: [
		{
			name: "slug",
			type: "string"
		},
		{
			name: "publishedAt",
			type: "uint64"
		},
		{
			name: "revision",
			type: "uint16"
		},
		{
			name: "priorAttestation",
			type: "bytes32"
		}
	],
	ArticleSubject: [
		{
			name: "title",
			type: "string"
		},
		{
			name: "contentDigest",
			type: "bytes32"
		},
		{
			name: "locale",
			type: "string"
		}
	]
};
const ATTESTATION_PRIMARY_TYPE = "Attestation";
/**
* Sentinel value for `priorAttestation` when this is the first revision.
*/
const NO_PRIOR_ATTESTATION = "0x0000000000000000000000000000000000000000000000000000000000000000";
//#endregion
export { NO_PRIOR_ATTESTATION as i, ATTESTATION_PRIMARY_TYPE as n, ATTESTATION_TYPES_V1 as r, ATTESTATION_DOMAIN_V1 as t };

//# sourceMappingURL=eip712-schema.js.map