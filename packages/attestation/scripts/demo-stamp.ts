/**
 * Demo: stamps the existing en.attestation.json digest on the OpenTimestamps
 * public calendars and writes the resulting en.ots file. Real network call,
 * the proof becomes Bitcoin-anchored after ~24h (run `attestation upgrade`
 * to fetch the Bitcoin attestation when ready).
 *
 * Run from packages/attestation:
 *   npx tsx scripts/demo-stamp.ts <article-folder>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { stampDigest } from '../src/ots/stamp.js';

const [folder] = process.argv.slice(2);
if (!folder) {
    console.error('Usage: tsx scripts/demo-stamp.ts <article-folder>');
    process.exit(1);
}

const contentDir = join(process.cwd(), '..', '..', 'content', folder);
const attestationPath = join(contentDir, 'en.attestation.json');
const otsPath = join(contentDir, 'en.ots');

const raw = await readFile(attestationPath, 'utf8');
const parsed = JSON.parse(raw) as { subject: { contentDigest: `0x${string}` } };
const digest = hexToBytes(parsed.subject.contentDigest);

console.log(`→ Stamping digest ${parsed.subject.contentDigest} on OTS calendars…`);
const otsBytes = await stampDigest(digest);

await writeFile(otsPath, Buffer.from(otsBytes));
console.log(`✓ Wrote ${otsPath} (${otsBytes.length} bytes, calendar-only)`);
console.log(`  Run \`attestation upgrade ${otsPath}\` in ~24h to attach the Bitcoin attestation.`);

function hexToBytes(hex: `0x${string}`): Uint8Array {
    const stripped = hex.slice(2);
    const out = new Uint8Array(stripped.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
