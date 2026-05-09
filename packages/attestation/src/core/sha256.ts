import { sha256 } from '@noble/hashes/sha2.js';

/**
 * SHA-256 of bytes, returned as bare hex (no 0x prefix).
 *
 * Uses @noble/hashes — pure JS, sync, audited, runs identically in Node, Bun,
 * Deno, and every modern browser. This is the only hash primitive used by the
 * package, so swapping the implementation here is the single point of change.
 */
export function sha256Hex(bytes: Uint8Array): string {
    const out = sha256(bytes);
    let hex = '';
    for (const byte of out) {
        hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
}
