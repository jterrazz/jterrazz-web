import { describe, expect, it } from 'vitest';

import { CANONICAL_VERSION, SCHEMA_VERSION } from './index.js';

describe('@jterrazz/attestation', () => {
    it('freezes the schema version at 1', () => {
        expect(SCHEMA_VERSION).toBe(1);
    });

    it('freezes the canonicalization version at 1', () => {
        expect(CANONICAL_VERSION).toBe(1);
    });
});
