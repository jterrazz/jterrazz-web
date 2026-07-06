/**
 * Attach the Bitcoin block time to each article's en.attestation.json.
 *
 * Run after `attestation upgrade` on the content .ots files: verifies every upgraded
 * proof against its signed digest and writes the block time into the
 * `bitcoinTimestamp` field (outside the EIP-712 payload, so signatures stay
 * valid). Already-stamped articles are skipped — re-running is safe.
 *
 * Usage:
 *   tsx scripts/attach-bitcoin-timestamps.ts
 */

import { verifyOts } from '@jterrazz/attestation/node';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const contentDir = join(process.cwd(), 'content');

const hexToBytes = (hex: string): Uint8Array => {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
};

// Match the on-disk convention: 2-space indent, alphabetically sorted keys
const sortKeys = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(sortKeys);
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => [k, sortKeys(v)]),
        );
    }
    return value;
};

let updated = 0;
let pending = 0;

for (const folder of readdirSync(contentDir).sort()) {
    const attestationPath = join(contentDir, folder, 'en.attestation.json');
    const otsPath = join(contentDir, folder, 'en.ots');
    if (!existsSync(attestationPath) || !existsSync(otsPath)) {
        continue;
    }

    const attestation = JSON.parse(readFileSync(attestationPath, 'utf8')) as {
        bitcoinTimestamp?: string;
        subject: { contentDigest: `0x${string}` };
    };
    if (attestation.bitcoinTimestamp) {
        console.log(`· ${folder} — already stamped (${attestation.bitcoinTimestamp})`);
        continue;
    }

    const digest = hexToBytes(attestation.subject.contentDigest);
    const result = await verifyOts(digest, new Uint8Array(readFileSync(otsPath)));

    if (!result.ok) {
        pending += 1;
        console.log(`✗ ${folder} — not anchored yet (${(result as { reason?: string }).reason})`);
        continue;
    }

    attestation.bitcoinTimestamp = result.bitcoinBlockTime.toISOString();
    writeFileSync(attestationPath, `${JSON.stringify(sortKeys(attestation), null, 2)}\n`);
    updated += 1;
    console.log(`✓ ${folder} — anchored at ${attestation.bitcoinTimestamp}`);
}

console.log(`\n${updated} attestation(s) updated, ${pending} still pending.`);
