/**
 * Demo: signs one article with the Hardhat test wallet (NO browser, NO MetaMask)
 * and writes en.attestation.json next to en.md.
 *
 * Run from packages/attestation:
 *   npx tsx scripts/demo-sign.ts <article-folder> <slug>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createAttestation } from '../src/attestation/create.js';
import { stringify } from '../src/attestation/serialize.js';
import { testAccount } from '../tests/setup/test-wallet.js';

const [folder, slug] = process.argv.slice(2);
if (!folder || !slug) {
    console.error('Usage: tsx scripts/demo-sign.ts <article-folder> <slug>');
    process.exit(1);
}

const contentDir = join(process.cwd(), '..', '..', 'content', folder);

// Only sign the English source. The badge / verify page show this single
// Attestation on every locale of the article.
const content = await readFile(join(contentDir, 'en.md'), 'utf8');
const account = testAccount();
const signed = await createAttestation(
    {
        content,
        locale: 'en',
        publishedAt: new Date('2025-05-09T00:00:00Z'),
        slug,
        title: folder,
    },
    account,
);

await writeFile(join(contentDir, 'en.attestation.json'), stringify(signed), 'utf8');
console.log(`✓ Wrote ${folder}/en.attestation.json`);
