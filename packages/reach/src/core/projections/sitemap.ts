import { KIND_DEFAULTS, type PageDefinition } from '../model/page';
import type { SiteDefinition } from '../model/site';
import { alternatesFor, urlFor } from '../model/urls';

/**
 * Sitemap projection — one entry per page per existing locale, kind-driven
 * priorities, honest lastModified (absent rather than fabricated).
 */

export interface SitemapEntry {
    alternates: { languages: Record<string, string> };
    changeFrequency: 'monthly' | 'weekly';
    lastModified?: Date;
    priority: number;
    url: string;
}

export function projectSitemap(site: SiteDefinition, pages: PageDefinition[]): SitemapEntry[] {
    return pages.flatMap((page) => {
        const defaults = KIND_DEFAULTS[page.kind];
        const alternates = { languages: alternatesFor(site, page) };
        const modified = page.dates?.modified;

        return page.locales.map((locale) => ({
            alternates,
            changeFrequency: defaults.changeFrequency,
            ...(modified ? { lastModified: new Date(modified) } : {}),
            priority: defaults.priority,
            url: urlFor(site, page.path, locale),
        }));
    });
}
