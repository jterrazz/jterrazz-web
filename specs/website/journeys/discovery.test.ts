import { button, content, link, main, navigation, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { pathOf, standaloneByCategory } from './subjects';

/**
 * A visitor who does not know what they want browses. The category filter is
 * client state over a server-rendered list, so a key drifting from the domain
 * enum empties the list without erroring — 200, no content, nothing reports it.
 *
 * `button('Experiments')` and the nav's `link('Experiments')` share a name; the
 * role is what separates them, which is the whole argument for naming elements
 * the way a user perceives them.
 */

test('narrows the list to reflections', async () => {
    // Given - a visitor on the full article list
    const articles = standaloneByCategory();
    const result = await website.visit('/articles', async (visitor) => {
        // When - they pick a category
        await visitor.click(within(main(), button('Reflections')));
        await visitor.see(link(articles.reflection.metadata.title.en));
    });

    // Then - the category is kept and the other one is gone
    expect(result.content).toContain(articles.reflection.metadata.title.en);
    expect(result.content).not.toContain(articles.exploration.metadata.title.en);
});

test('narrows the list to experiments', async () => {
    // Given - a visitor on the full article list
    const articles = standaloneByCategory();
    const result = await website.visit('/articles', async (visitor) => {
        // When - they pick the other category
        await visitor.click(within(main(), button('Experiments')));
        await visitor.see(link(articles.exploration.metadata.title.en));
    });

    // Then - the filter is symmetric
    expect(result.content).toContain(articles.exploration.metadata.title.en);
    expect(result.content).not.toContain(articles.reflection.metadata.title.en);
});

test('opens an article found through a filter', async () => {
    // Given - a visitor who has narrowed the list
    const article = standaloneByCategory().reflection;
    const result = await website.visit('/articles', async (visitor) => {
        // When - they open one of the results
        await visitor.click(within(main(), button('Reflections')));
        await visitor.click(within(main(), link(article.metadata.title.en)));
        // The description only exists on the article's own page — its title is
        // Already on the list, so waiting on that would race the navigation.
        await visitor.see(content(article.metadata.description.en));
    });

    // Then - the browse ends on that article
    expect(result.url).toContain(pathOf(article));
    expect(result.content).toContain(article.metadata.title.en);
});

test('reaches the list from the site navigation', async () => {
    // Given - a visitor landing on the homepage
    const result = await website.visit('/', async (visitor) => {
        // When - they browse to the articles section
        await visitor.click(within(navigation(), link('Articles')));
        await visitor.see(within(main(), button('Reflections')));
    });

    // Then - the collection page, with its own canonical
    expect(result.url).toContain('/articles');
    expect(result.canonical).toContain('/articles');
});
