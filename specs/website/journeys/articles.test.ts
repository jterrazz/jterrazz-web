import { content, link } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';

test('reaches an article from the homepage', async () => {
    // Given - a visitor landing on the homepage
    const result = await website.visit('/', async (visitor) => {
        // When - they browse to the articles section
        await visitor.click(link('Articles'));
        await visitor.see(content('Notes on what I learn'));
    });

    // Then - the collection page is realized with its own canonical
    expect(result.url).toContain('/articles');
    expect(result.canonical).toContain('/articles');
    expect(result.status).toBe(200);
});

test('serves the french locale with its own canonical', async () => {
    // Given - the french homepage
    const result = await website.visit('/fr');

    // Then - self-canonical, no cross-locale consolidation
    expect(result.status).toBe(200);
    expect(result.canonical).toContain('/fr');
});
