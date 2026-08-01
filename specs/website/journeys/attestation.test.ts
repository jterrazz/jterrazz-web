import { button, content, link, main, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { attestedArticle, pathOf } from './subjects';

/**
 * The site claims its articles are cryptographically signed and anchored to
 * Bitcoin. That claim is verified in the reader's own browser — EIP-712
 * recovery against /proof.json, then the OpenTimestamps proof.
 *
 * This is the one journey where a silent failure makes the site actively
 * dishonest: if verification degrades to Failed, the page still answers 200
 * and still says "Signed by". So the assertion is the resolved verdict, and
 * `see()` doing the waiting is the whole point — a claim stuck on its spinner
 * fails here rather than shipping.
 */

/** Both claims live behind a disclosure; only the first is open on arrival. */
const verifyPath = (): string => `${pathOf(attestedArticle())}/verify`;

test('resolves the authorship claim to verified in the browser', async () => {
    // Given - a reader opening the proof page of an attested article
    const result = await website.visit(verifyPath(), async (visitor) => {
        // When - the browser finishes recovering the signature
        await visitor.see(within(button('Proof of authorship'), content('Verified')));
    });

    // Then - the claim held, and the recovery is stated as local to the reader
    expect(result.status).toBe(200);
    expect(result.content).toContain('Verified locally in your browser');
});

test('explains the date claim whatever the anchor says', async () => {
    // Given - a reader on the proof page, with the Bitcoin block source under
    // Contract: the stub backend (OTS_EXPLORER_URL) serves frozen real Esplora
    // Data the proof's Merkle path verifies against, so any runtime resolution
    // Of verify-ots.json is pinned to declared exchanges instead of the network
    const result = await website
        .intercept('anchored-block.http')
        .visit(verifyPath(), async (visitor) => {
            // When - they expand the date claim
            await visitor.click(button('Proof of date'));
            await visitor.see(content('Proof of date'));
        });

    // Then - the section explains where the date stands, in every state it can
    // Be in. The verdict itself is still NOT asserted: verify-ots.json is ISR-
    // Prerendered (`revalidate = 3600`), so the answer a visit receives comes
    // From the `next build` snapshot — computed with the REAL calendars and
    // Block source, no stub env in the build child — verified empirically: the
    // Spec's outcome did not change when the intercept data was corrupted, and
    // The snapshot body in .next carried the verdict. Pinning "Anchored" would
    // Therefore still make the spec depend on third parties being up at build
    // Time. The stub earns its keep on the other side of the boundary: when
    // The snapshot ages out and ISR revalidates at runtime, the block lookup
    // Resolves against the declared exchanges above, not the open network.
    const dateSection = result.content.text.split('Proof of date')[1] ?? '';
    expect(dateSection).toMatch(/Bitcoin|OpenTimestamps/);
});

test('reaches the proof from the badge under the article', async () => {
    // Given - a reader who finished an attested article
    const article = attestedArticle();
    const result = await website.visit(pathOf(article), async (visitor) => {
        // When - they follow the signature badge in the byline
        await visitor.click(within(main(), link('Verify attestation')));
        await visitor.see(content('Verify this article'));
    });

    // Then - the proof page for that same article
    expect(result.url).toContain(`${pathOf(article)}/verify`);
});
