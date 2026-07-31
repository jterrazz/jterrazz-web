import { content, heading, link, main, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { latestArticle, pathOf, seriesRun } from './subjects';

/**
 * The dominant journey: a reader arrives straight on an article from search,
 * a share or an AI citation — never through the homepage. The article has to
 * stand on its own, and offer somewhere to go next.
 *
 * What the surface specs cannot see: they assert the head, so an article whose
 * body failed to render still passes them with a 200. Reading length is the
 * cheap proxy that catches it.
 */

/** Shortest article body worth calling rendered — an empty shell falls far below. */
const MINIMUM_BODY_LENGTH = 1500;

test('reads an article arrived at directly', async () => {
    // Given - a reader landing on the latest article, as a search result would
    const article = latestArticle();
    const result = await website.visit(pathOf(article), async (visitor) => {
        // When - the masthead resolves
        await visitor.see(heading(article.metadata.title.en));
    });

    // Then - the page is self-sufficient: masthead, byline, and a rendered body
    expect(result.status).toBe(200);
    expect(result.content).toContain(article.metadata.title.en);
    expect(result.content).toContain('Written by');
    expect(result.content.text.length).toBeGreaterThan(MINIMUM_BODY_LENGTH);
});

test('leaves an article through the reading it suggests next', async () => {
    // Given - a reader at the foot of the opening part of a series
    const [entry, sibling] = seriesRun();
    const result = await website.visit(pathOf(entry), async (visitor) => {
        // When - they follow one of the articles it recommends
        await visitor.click(within(main(), link(sibling.metadata.title.en)));
        // Its description is unique to its own page; its title is already here.
        await visitor.see(content(sibling.metadata.description.en));
    });

    // Then - they land on that article, not back where they started
    expect(result.url).toContain(pathOf(sibling));
    expect(result.content).toContain(sibling.metadata.title.en);
});
