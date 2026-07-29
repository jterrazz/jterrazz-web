import { button, content, main, within } from '@jterrazz/test';
import { expect, test } from 'vitest';

import { website } from '../website.specification';
import { firstPhotographs } from './subjects';

/**
 * The gallery is one of the three top-level sections and its only interaction
 * is the lightbox. Escape and the focus trap are the browser's — it is a native
 * `<dialog>` — so what is worth walking is what the component actually owns:
 * opening onto the right photograph, stepping between them, and closing.
 *
 * Kept to open/step/close on purpose. Asserting the masonry layout would be
 * asserting CSS columns, and the failures here are visible rather than silent.
 */

test('opens a photograph into the lightbox', async () => {
    // Given - a visitor on the gallery
    const [first] = firstPhotographs();
    const result = await website.visit('/photographs', async (visitor) => {
        // When - they open the first photograph
        await visitor.click(within(main(), button(first.metadata.description)));
        await visitor.see(button('Close'));
    });

    // Then - the lightbox carries that photograph's caption
    expect(result.content).toContain(first.metadata.description);
});

test('steps to the next photograph without leaving the lightbox', async () => {
    // Given - a visitor with the first photograph open
    const [first, second] = firstPhotographs();
    const result = await website.visit('/photographs', async (visitor) => {
        await visitor.click(within(main(), button(first.metadata.description)));
        await visitor.see(button('Close'));

        // When - they step forward
        await visitor.click(button('Next photograph'));
        await visitor.see(content(second.metadata.description));
    });

    // Then - the caption followed, and the lightbox is still up
    expect(result.content).toContain(second.metadata.description);
    expect(result.url).toContain('/photographs');
});

test('closes the lightbox and returns to the grid', async () => {
    // Given - a visitor with a photograph open
    const [first] = firstPhotographs();
    const result = await website.visit('/photographs', async (visitor) => {
        await visitor.click(within(main(), button(first.metadata.description)));
        await visitor.see(button('Close'));

        // When - they close it
        await visitor.click(button('Close'));
    });

    // Then - the caption is gone with the dialog
    expect(result.content).not.toContain(first.metadata.description);
});
