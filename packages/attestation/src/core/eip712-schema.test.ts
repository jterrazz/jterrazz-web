import { hashTypedData } from 'viem';
import { describe, expect, it } from 'vitest';

import {
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
    NO_PRIOR_ATTESTATION,
} from './eip712-schema.js';

describe('EIP-712 schema v1 — frozen contract', () => {
    it('domain has the exact frozen values', () => {
        expect(ATTESTATION_DOMAIN_V1).toEqual({
            chainId: 1,
            name: 'jterrazz.com Article Attestation',
            version: '1',
        });
    });

    it('types are exactly the frozen v1 shape', () => {
        expect(ATTESTATION_TYPES_V1).toMatchSnapshot();
    });

    it('primary type is "Attestation"', () => {
        expect(ATTESTATION_PRIMARY_TYPE).toBe('Attestation');
    });

    it('NO_PRIOR_ATTESTATION is 32 zero bytes', () => {
        expect(NO_PRIOR_ATTESTATION).toBe(`0x${'0'.repeat(64)}`);
    });

    it('hashTypedData on a known message produces a stable digest', () => {
        const message: AttestationMessage = {
            claims: {
                priorAttestation: NO_PRIOR_ATTESTATION,
                publishedAt: 1_715_212_800n,
                revision: 1,
                slug: 'architects-of-inversion',
            },
            schemaVersion: 1,
            subject: {
                contentDigest: `0x${'a'.repeat(64)}`,
                locale: 'en',
                title: 'Architects of Inversion',
            },
        };

        const digest = hashTypedData({
            domain: ATTESTATION_DOMAIN_V1,
            message,
            primaryType: ATTESTATION_PRIMARY_TYPE,
            types: ATTESTATION_TYPES_V1,
        });

        // Snapshot — drift here means the schema or one of its bytes silently changed.
        expect(digest).toMatchSnapshot();
    });
});
