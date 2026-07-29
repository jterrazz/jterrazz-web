import { content, link, main, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { pathOf, seriesRun } from './subjects';

/**
 * A reader who finishes one part of a series wants the next one. The masthead
 * nav is the only affordance for that, and it renders conditionally — if the
 * series wiring drifts (a retitle, a date, a slug), the nav quietly disappears
 * and every reader dead-ends on a page that still answers 200. A coverage
 * crawl cannot see a link that is absent.
 *
 * The wait is on the destination's description, not its title: sibling titles
 * are rendered as headings in the footer of every part, so a title would
 * already be visible before the click and the capture would race the
 * navigation.
 */

test('continues to the next part of a series', async () => {
    // Given - a reader on the opening part
    const [first, second] = seriesRun();
    const result = await website.visit(pathOf(first), async (visitor) => {
        // When - they follow the forward affordance
        await visitor.click(within(main(), link('Next')));
        await visitor.see(content(second.metadata.description.en));
    });

    // Then - they are on the part that publication order puts next
    expect(result.url).toContain(pathOf(second));
});

test('walks back to the part before', async () => {
    // Given - a reader on the second part
    const [first, second] = seriesRun();
    const result = await website.visit(pathOf(second), async (visitor) => {
        // When - they follow the backward affordance
        await visitor.click(within(main(), link('Prev')));
        await visitor.see(content(first.metadata.description.en));
    });

    // Then - they are back on the opening part
    expect(result.url).toContain(pathOf(first));
});

test('keeps every part of the run reachable from the one being read', async () => {
    // Given - a reader on the opening part of a run
    const run = seriesRun();
    const result = await website.visit(pathOf(run[0]));

    // Then - the footer lists the whole series, so no part is orphaned
    for (const part of run) {
        expect(result.content).toContain(part.metadata.title.en);
    }
});
