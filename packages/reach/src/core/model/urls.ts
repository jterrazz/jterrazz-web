import type { PageDefinition } from './page';
import type { SiteDefinition } from './site';

/**
 * URL policy — the ONE place URLs are built. Locale prefixes, x-default,
 * and host consistency live here so no surface can drift from another.
 */

/** Absolute URL of a path in a locale. */
export function urlFor(site: SiteDefinition, path: string, locale: string): string {
    const prefixed =
        locale === site.languages.main && !site.languages.prefixMain ? path : `/${locale}${path}`;
    return `${site.address}${prefixed}`;
}

/**
 * Hreflang alternates of a page — one entry per existing locale, plus
 * x-default only when the main locale genuinely exists.
 */
export function alternatesFor(site: SiteDefinition, page: PageDefinition): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of page.locales) {
        languages[locale] = urlFor(site, page.path, locale);
    }
    if (page.locales.includes(site.languages.main)) {
        languages['x-default'] = urlFor(site, page.path, site.languages.main);
    }
    return languages;
}
