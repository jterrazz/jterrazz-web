import { banner, button, content, link, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { pathOf, translatedArticle, untranslatedArticle } from './subjects';

/**
 * Switching language must keep the reader where they were. The switcher builds
 * its target by slicing the current pathname, which is exactly the kind of
 * string surgery that fails on one shape and still lands on a valid 200 page —
 * just the wrong one. No surface spec can tell those apart.
 *
 * `{ exact: true }` on the locale codes is not decoration: "EN" is a substring
 * of "Expérimentations", so the plain descriptor matches the nav link too.
 */

test('keeps the reader on the same article when switching to french', async () => {
    // Given - a reader partway through an article that exists in both locales
    const article = translatedArticle();
    const result = await website.visit(pathOf(article), async (visitor) => {
        // When - they switch language from the site header
        await visitor.click(within(banner(), button('EN', { exact: true })));
        await visitor.click(within(banner(), link('FR', { exact: true })));
        await visitor.see(content(article.metadata.description.fr));
    });

    // Then - the same article, in french, under the french prefix
    expect(result.url).toContain(`/fr${pathOf(article)}`);
    expect(result.content).toContain(article.metadata.description.fr);
});

test('carries the reader back out of french to the same article', async () => {
    // Given - a reader on the french rendering of that article
    const article = translatedArticle();
    const result = await website.visit(`/fr${pathOf(article)}`, async (visitor) => {
        // When - they switch back
        await visitor.click(within(banner(), button('FR', { exact: true })));
        await visitor.click(within(banner(), link('EN', { exact: true })));
        await visitor.see(content(article.metadata.description.en));
    });

    // Then - the default locale drops the prefix and keeps the article
    expect(result.url).toContain(pathOf(article));
    expect(result.url).not.toContain('/fr/');
});

test('declares a translated article as its own canonical', async () => {
    // Given - the french rendering of a translated article
    const path = `/fr${pathOf(translatedArticle())}`;
    const result = await website.visit(path);

    // Then - self-canonical, so the locales are not consolidated away
    expect(result.canonical).toContain(path);
    expect(result.alternates.fr).toContain(path);
});

test('points an untranslated article back at its english source', async () => {
    // Given - an article with no french source, requested under /fr
    const article = untranslatedArticle();
    const result = await website.visit(`/fr${pathOf(article)}`);

    // Then - it serves, but hands indexing to english rather than competing
    // With it. Deliberate: the body is the english source either way.
    expect(result.status).toBe(200);
    expect(result.canonical).toContain(pathOf(article));
    expect(result.canonical).not.toContain('/fr/');
});
