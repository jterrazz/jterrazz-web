import { defineContract, http } from '@jterrazz/test';

// Block hash for height 956940 — where one calendar anchored the proof. The
// Value is frozen (real Esplora data), so the OTS Merkle path this backs
// Verifies against a block that will never move.
export default defineContract({
    request: http.get('/block-height/956940'),
    response: http.text('00000000000000000000ca49f36a9eb58052dd451b1a3aca9336a7f26af65865'),
});
