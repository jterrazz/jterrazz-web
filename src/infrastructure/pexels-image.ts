/**
 * Responsive variants for Pexels-hosted photographs.
 *
 * The photographs are served straight from the Pexels CDN rather than through
 * `next/image`: Pexels already resizes on demand and already content-negotiates
 * AVIF from `auto=compress`, so routing them through our origin would only add
 * a fetch, a re-encode and cache pressure for no gain.
 *
 * What it does not do on its own is pick a width — every visitor used to get
 * the same 800px file. These helpers rebuild the URL per width so the browser
 * can choose, which is worth ~3x on a non-retina screen (22KB at 400px against
 * 66KB at 800px for the same photograph).
 */

// Covers 1x, 2x and 3x for the widest column the grid ever renders (~395px).
const SRCSET_WIDTHS = [300, 400, 600, 800, 1200] as const;

/** Opened from the grid, so it is worth more pixels than the tiles. */
const LIGHTBOX_WIDTH = 1600;

/**
 * Rebuilds a Pexels URL at a given width, dropping whatever query the source
 * carried (`w`, `lazy`, …) so the result is exactly what we asked for.
 */
export function buildPexelsUrl(contentUrl: string, width: number): string {
    const [base] = contentUrl.split('?');
    return `${base}?auto=compress&cs=tinysrgb&w=${width}`;
}

export function buildPexelsSrcSet(contentUrl: string): string {
    return SRCSET_WIDTHS.map((w) => `${buildPexelsUrl(contentUrl, w)} ${w}w`).join(', ');
}

export function buildPexelsLightboxUrl(contentUrl: string): string {
    return buildPexelsUrl(contentUrl, LIGHTBOX_WIDTH);
}

/**
 * Mirrors the grid's column maths (`columns-1 sm:columns-2 lg:columns-3`,
 * 24px gaps, inside the `wide` container capped at 80rem with px-4/md:px-6).
 * Keep in sync with the class list in `photograph-gallery.tsx`.
 */
export const PHOTOGRAPH_SIZES = [
    '(max-width: 639px) calc(100vw - 32px)',
    '(max-width: 767px) calc((100vw - 56px) / 2)',
    '(max-width: 1023px) calc((100vw - 72px) / 2)',
    '(max-width: 1279px) calc((100vw - 96px) / 3)',
    '395px',
].join(', ');

/** Tiles above the fold on a phone; the rest are lazy. */
export const PHOTOGRAPH_EAGER_COUNT = 2;
