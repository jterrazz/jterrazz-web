/**
 * Batch sign every article that has en.md but no en.attestation.json yet.
 *
 * Flow:
 *  1. Walk articlesRepository, filter unsigned articles with English source.
 *  2. Build EIP-712 messages locally (no network).
 *  3. Spin up the batch sign browser flow → MetaMask popups walk through every
 *     article in one session. Reject one → it's flagged "skipped" and the
 *     loop continues.
 *  4. Write each en.attestation.json.
 *  5. Stamp every signed digest on the public OpenTimestamps calendars,
 *     write each en.ots.
 *
 * Re-running is safe: already-signed articles are skipped, you can resume.
 *
 * Usage:
 *   tsx scripts/sign-all.ts                # default
 *   tsx scripts/sign-all.ts --skip-stamp   # signature only, stamp later
 */

import { buildAttestationMessage, stringify } from '@jterrazz/attestation';
import { type BatchSignEntry, signBatchViaBrowser, stampDigest } from '@jterrazz/attestation/node';
import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { type Article } from '../src/domain/article';
import { buildArticleSlug } from '../src/domain/utils/slugify';
import { articlesRepository } from '../src/infrastructure/repositories/articles.repository';

const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
        list: { type: 'boolean' },
        'skip-stamp': { type: 'boolean' },
    },
});

const contentDir = join(process.cwd(), 'content');

const all = articlesRepository.getAll();
const work: Array<{ article: Article; filename: string; rawContent: string }> = [];

for (const article of all) {
    if (article.attestation) {
        continue;
    } // Already signed
    const filename = articlesRepository.getFilenameByIndex(article.publicIndex);
    if (!filename) {
        continue;
    }
    const enMdPath = join(contentDir, filename, 'en.md');
    if (!existsSync(enMdPath)) {
        continue;
    }
    const rawContent = readFileSync(enMdPath, 'utf8');
    work.push({ article, filename, rawContent });
}

if (work.length === 0) {
    console.log('Nothing to sign — every article already has en.attestation.json.');
    process.exit(0);
}

console.log(`→ ${work.length} article(s) to sign:`);
for (const { article, filename } of work) {
    const slug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
    console.log(`   · [${slug}] ${article.metadata.title.en}`);
    console.log(`     ${filename}`);
}
console.log();

if (values.list) {
    console.log('(--list mode: nothing signed, exiting)');
    process.exit(0);
}

const entries: BatchSignEntry[] = work.map(({ article, filename, rawContent }) => ({
    id: filename,
    label: article.metadata.title.en,
    message: buildAttestationMessage({
        content: rawContent,
        locale: 'en',
        publishedAt: new Date(article.metadata.datePublished),
        slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
        title: article.metadata.title.en,
    }),
}));

console.log('→ Opening browser for batch signature… MetaMask will pop up once per article.\n');
const result = await signBatchViaBrowser({ entries });

console.log();
console.log(`✓ ${result.signatures.size} signed, ${result.skipped.size} skipped.\n`);

for (const { article, filename, rawContent } of work) {
    void rawContent; // Canonical bytes already locked into the signed message
    const sig = result.signatures.get(filename);
    if (!sig) {
        const reason = result.skipped.get(filename);
        if (reason) {
            console.log(`× ${article.metadata.title.en}: ${reason}`);
        }
        continue;
    }

    const message = entries.find((e) => e.id === filename)!.message;
    const signed = { ...message, signature: sig.signature, signerAddress: sig.signerAddress };
    const attestationPath = join(contentDir, filename, 'en.attestation.json');
    await writeFile(attestationPath, stringify(signed), 'utf8');
    console.log(`✓ ${article.metadata.title.en}`);
    console.log(`  ${attestationPath}`);

    if (values['skip-stamp']) {
        continue;
    }
    try {
        const digest = hexToBytes(message.subject.contentDigest);
        const otsBytes = await stampDigest(digest);
        const otsPath = join(contentDir, filename, 'en.ots');
        await writeFile(otsPath, Buffer.from(otsBytes));
        console.log(`  ${otsPath} (${otsBytes.length} bytes, calendar-only)`);
    } catch (error) {
        console.log(`  ! OTS stamping failed: ${(error as Error).message}`);
    }
}

console.log(
    '\nDone. Run `attestation upgrade content/*/en.ots` in ~24h to attach Bitcoin attestations.',
);

function hexToBytes(hex: `0x${string}`): Uint8Array {
    const stripped = hex.slice(2);
    const out = new Uint8Array(stripped.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
