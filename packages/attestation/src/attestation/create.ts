import { type LocalAccount } from 'viem';

import { canonicalize } from '../core/canonicalize.js';
import {
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
    NO_PRIOR_ATTESTATION,
} from '../core/eip712-schema.js';
import { sha256Hex } from '../core/sha256.js';
import { SCHEMA_VERSION } from '../version.js';
import { type SignedAttestation } from './types.js';

export type CreateAttestationInput = {
    content: string;
    title: string;
    slug: string;
    locale: string;
    publishedAt: bigint | Date | number;
    revision?: number;
    priorAttestation?: `0x${string}`;
};

export function buildAttestationMessage(input: CreateAttestationInput): AttestationMessage {
    const bytes = canonicalize(input.content);
    const digest = sha256Hex(bytes);

    return {
        claims: {
            priorAttestation: input.priorAttestation ?? NO_PRIOR_ATTESTATION,
            publishedAt: toUnixSeconds(input.publishedAt),
            revision: input.revision ?? 1,
            slug: input.slug,
        },
        schemaVersion: SCHEMA_VERSION,
        subject: {
            contentDigest: `0x${digest}` as const,
            locale: input.locale,
            title: input.title,
        },
    };
}

export async function signAttestation(
    message: AttestationMessage,
    account: LocalAccount,
): Promise<SignedAttestation> {
    const signature = await account.signTypedData({
        domain: ATTESTATION_DOMAIN_V1,
        message,
        primaryType: ATTESTATION_PRIMARY_TYPE,
        types: ATTESTATION_TYPES_V1,
    });

    return {
        ...message,
        signature,
        signerAddress: account.address,
    };
}

export async function createAttestation(
    input: CreateAttestationInput,
    account: LocalAccount,
): Promise<SignedAttestation> {
    return signAttestation(buildAttestationMessage(input), account);
}

function toUnixSeconds(value: bigint | Date | number): bigint {
    if (typeof value === 'bigint') {
        return value;
    }
    if (typeof value === 'number') {
        return BigInt(Math.floor(value));
    }
    return BigInt(Math.floor(value.getTime() / 1000));
}
