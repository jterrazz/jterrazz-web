import { type TypedData, type TypedDataDomain } from 'viem';

import { SCHEMA_VERSION } from '../version.js';

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

export const ATTESTATION_DOMAIN_V1 = {
    chainId: 1,
    name: 'jterrazz.com Article Attestation',
    version: '1',
} as const satisfies TypedDataDomain;

export const ATTESTATION_TYPES_V1 = {
    Attestation: [
        { name: 'schemaVersion', type: 'uint16' },
        { name: 'subject', type: 'ArticleSubject' },
        { name: 'claims', type: 'ArticleClaims' },
    ],
    ArticleClaims: [
        { name: 'slug', type: 'string' },
        { name: 'publishedAt', type: 'uint64' },
        { name: 'revision', type: 'uint16' },
        { name: 'priorAttestation', type: 'bytes32' },
    ],
    ArticleSubject: [
        { name: 'title', type: 'string' },
        { name: 'contentDigest', type: 'bytes32' },
        { name: 'locale', type: 'string' },
    ],
} as const satisfies TypedData;

export const ATTESTATION_PRIMARY_TYPE = 'Attestation' as const;

/**
 * Sentinel value for `priorAttestation` when this is the first revision.
 */
export const NO_PRIOR_ATTESTATION =
    '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

export type ArticleSubject = {
    title: string;
    contentDigest: `0x${string}`;
    locale: string;
};

export type ArticleClaims = {
    slug: string;
    publishedAt: bigint;
    revision: number;
    priorAttestation: `0x${string}`;
};

export type AttestationMessage = {
    schemaVersion: number;
    subject: ArticleSubject;
    claims: ArticleClaims;
};

export const currentSchemaVersion = SCHEMA_VERSION;
