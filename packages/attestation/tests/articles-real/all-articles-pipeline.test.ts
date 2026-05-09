import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createAttestation } from '../../src/attestation/create.js';
import { stringify } from '../../src/attestation/serialize.js';
import { verifyAttestation } from '../../src/attestation/verify.js';
import { audit } from '../../src/core/audit.js';
import { canonicalize } from '../../src/core/canonicalize.js';
import { testAccount } from '../setup/test-wallet.js';

/**
 * Runs the full attestation pipeline against every real article in jterrazz-web.
 * Catches the case where an exotic Unicode char in a freshly written article
 * would break canonicalization or signing.
 *
 * NB: signs with the Hardhat test key — no real signatures produced.
 */

const CONTENT_DIR = join(process.cwd(), '..', '..', 'content');

type ArticleFile = {
    folder: string;
    locale: 'en' | 'fr';
    path: string;
};

function discoverArticles(): ArticleFile[] {
    let entries: string[];
    try {
        entries = readdirSync(CONTENT_DIR);
    } catch {
        return [];
    }

    const out: ArticleFile[] = [];
    for (const folder of entries) {
        const folderPath = join(CONTENT_DIR, folder);
        if (!statSync(folderPath).isDirectory()) {
            continue;
        }
        for (const locale of ['en', 'fr'] as const) {
            const filePath = join(folderPath, `${locale}.md`);
            try {
                statSync(filePath);
                out.push({ folder, locale, path: filePath });
            } catch {
                // Not present, skip
            }
        }
    }
    return out;
}

const articles = discoverArticles();

describe.skipIf(articles.length === 0)('every real article passes the full pipeline', () => {
    it.each(articles)(
        'canonicalize → audit → sign → verify roundtrip survives for $folder ($locale)',
        async ({ folder, locale, path }) => {
            const content = readFileSync(path, 'utf8');

            // 1. Canonicalize never throws on legitimate content.
            const canonical = canonicalize(content);
            expect(canonical.length).toBeGreaterThan(0);

            // 2. Audit returns a list (suspicious chars, if any). We don't fail here
            //    Because the user might have legitimate cases — but we report.
            const findings = audit(canonical);
            if (findings.length > 0) {
                process.stderr.write(
                    `! ${folder}/${locale}.md has ${findings.length} suspicious char(s)\n`,
                );
            }

            // 3. Sign with the test wallet.
            const account = testAccount();
            const signed = await createAttestation(
                {
                    content,
                    locale,
                    publishedAt: new Date('2026-01-01T00:00:00Z'),
                    slug: folder.toLowerCase().replace(/\s+/g, '-'),
                    title: folder,
                },
                account,
            );

            // 4. JSON roundtrip.
            const json = stringify(signed);
            expect(JSON.parse(json)).toBeTruthy();

            // 5. Verify with original content.
            const result = await verifyAttestation({ attestation: signed, content });
            expect(result.ok).toBe(true);
        },
    );
});
