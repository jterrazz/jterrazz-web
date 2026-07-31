import { content, heading, link, main, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';

/**
 * The one journey that begins with the visitor already lost — a moved article,
 * a mistyped path, a share that outlived its URL. Every other page assumes the
 * reader got where they meant to go; this one exists to give them a way out.
 *
 * The status matters as much as the page: a recovery page served with a 200
 * would be a soft-404, and search engines would index the dead link.
 */

test('offers a way out of a dead link', async () => {
    // Given - a visitor on a path that does not resolve
    const result = await website.visit('/this-page-does-not-exist', async (visitor) => {
        // When - they look for somewhere to go
        await visitor.see(heading('This page does not exist'));
    });

    // Then - the error status is honest, and the sections are all offered
    expect(result.status).toBe(404);
    expect(result.content).toContain('Articles');
    expect(result.content).toContain('Experiments');
    expect(result.content).toContain('Photographs');
});

test('carries the visitor from a dead link into the articles', async () => {
    // Given - a visitor who landed on nothing
    const result = await website.visit(
        '/articles/this-article-was-never-written',
        async (visitor) => {
            // When - they take one of the offered routes
            await visitor.click(within(main(), link('Articles')));
            await visitor.see(content('Notes on what I learn'));
        },
    );

    // Then - they are reading again rather than reaching for Back. No status
    // Assertion: `status` describes the document the visit opened, which is
    // Still the 404 — `url` and `content` are what reflect the final state.
    expect(result.url).toContain('/articles');
    expect(result.content).toContain('Notes on what I learn');
});

test('keeps the dead link out of the index', async () => {
    // Given - a path that does not resolve
    const result = await website.visit('/this-page-does-not-exist');

    // Then - noindex, so a stale share never becomes a ranked page
    expect(result.meta('robots')).toContain('noindex');
});
