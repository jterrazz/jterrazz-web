import { type SignedAttestation, type StoredAttestation } from './types.js';

export function toStored(att: SignedAttestation): StoredAttestation {
    return {
        claims: {
            priorAttestation: att.claims.priorAttestation,
            publishedAt: att.claims.publishedAt.toString(),
            revision: att.claims.revision,
            slug: att.claims.slug,
        },
        schemaVersion: att.schemaVersion,
        signature: att.signature,
        signerAddress: att.signerAddress,
        subject: att.subject,
    };
}

export function fromStored(stored: StoredAttestation): SignedAttestation {
    return {
        claims: {
            priorAttestation: stored.claims.priorAttestation,
            publishedAt: BigInt(stored.claims.publishedAt),
            revision: stored.claims.revision,
            slug: stored.claims.slug,
        },
        schemaVersion: stored.schemaVersion,
        signature: stored.signature,
        signerAddress: stored.signerAddress,
        subject: stored.subject,
    };
}

export function stringify(att: SignedAttestation): string {
    return `${JSON.stringify(toStored(att), null, 2)}\n`;
}

export function parse(json: string): SignedAttestation {
    const parsed = JSON.parse(json) as StoredAttestation;
    return fromStored(parsed);
}
