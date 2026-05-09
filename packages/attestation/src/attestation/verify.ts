import { recoverTypedDataAddress } from 'viem';

import { canonicalize } from '../core/canonicalize.js';
import {
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
} from '../core/eip712-schema.js';
import { sha256Hex } from '../core/sha256.js';
import { SCHEMA_VERSION } from '../version.js';
import { type SignedAttestation, type VerifyResult } from './types.js';

export type VerifyInput = {
    content: string;
    attestation: SignedAttestation;
};

export async function verifyAttestation(input: VerifyInput): Promise<VerifyResult> {
    const att = input.attestation;

    if (att.schemaVersion !== SCHEMA_VERSION) {
        return {
            error: { kind: 'schema-version-unsupported', version: att.schemaVersion },
            ok: false,
        };
    }

    const expected = att.subject.contentDigest;
    const actual = `0x${sha256Hex(canonicalize(input.content))}` as const;
    if (actual !== expected) {
        return {
            error: { actualDigest: actual, expectedDigest: expected, kind: 'content-mismatch' },
            ok: false,
        };
    }

    let recovered: `0x${string}`;
    try {
        recovered = await recoverTypedDataAddress({
            domain: ATTESTATION_DOMAIN_V1,
            message: { claims: att.claims, schemaVersion: att.schemaVersion, subject: att.subject },
            primaryType: ATTESTATION_PRIMARY_TYPE,
            signature: att.signature,
            types: ATTESTATION_TYPES_V1,
        });
    } catch (error) {
        return {
            error: { kind: 'invalid-signature', reason: (error as Error).message },
            ok: false,
        };
    }

    if (recovered.toLowerCase() !== att.signerAddress.toLowerCase()) {
        return {
            error: { declared: att.signerAddress, kind: 'signer-mismatch', recovered },
            ok: false,
        };
    }

    return { ok: true, signerAddress: recovered };
}
