import { type MetadataRoute } from 'next';

import { SITE_CONFIG } from '../config/site';
import { buildArticleSlug } from '../domain/utils/slugify';
import { locales } from '../i18n/config';
import { articlesRepository } from '../infrastructure/repositories/articles.repository';
import { experimentsRepository } from '../infrastructure/repositories/experiments.repository';

/**
 * Build URL with locale prefix (no prefix for English)
 */
function buildLocalizedUrl(baseUrl: string, path: string, locale: string): string {
    if (locale === 'en') {
        return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${locale}${path}`;
}

/**
 * Hreflang alternates for a path, for every locale plus x-default.
 * Google reads these from the sitemap even without per-page link tags.
 */
function buildAlternates(
    baseUrl: string,
    path: string,
    availableLocales: readonly string[],
): { languages: Record<string, string> } {
    const languages: Record<string, string> = {};
    for (const locale of availableLocales) {
        languages[locale] = buildLocalizedUrl(baseUrl, path, locale);
    }
    // X-default must resolve to a real page — only declare it when EN exists.
    if (availableLocales.includes('en')) {
        languages['x-default'] = buildLocalizedUrl(baseUrl, path, 'en');
    }
    return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_CONFIG.baseUrl;

    const articles = articlesRepository.getAll().filter((article) => article.published);
    const experiments = experimentsRepository.getAll();

    // Stable proxy for "site last changed": the most recent article edit.
    // Using `new Date()` would advertise a fake change on every build.
    const latestContentDate = articles.reduce<Date>((latest, article) => {
        const modified = new Date(article.metadata.dateModified);
        return modified > latest ? modified : latest;
    }, new Date(0));

    // Generate article URLs for all locales where content exists
    const articleUrls = articles.flatMap((article) => {
        const languages = Object.keys(article.content).filter((lang) =>
            locales.includes(lang as (typeof locales)[number]),
        );
        const path = `/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`;
        const alternates = buildAlternates(baseUrl, path, languages);

        return languages.map((lang) => ({
            alternates,
            changeFrequency: 'monthly' as const,
            lastModified: new Date(article.metadata.dateModified),
            priority: 0.8,
            url: buildLocalizedUrl(baseUrl, path, lang),
        }));
    });

    // Generate experiment URLs for all locales
    const experimentUrls = experiments.flatMap((experiment) => {
        const path = `/experiments/${experiment.slug}`;
        const alternates = buildAlternates(baseUrl, path, locales);

        return locales.map((locale) => ({
            alternates,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            url: buildLocalizedUrl(baseUrl, path, locale),
        }));
    });

    // Main pages for all locales
    const mainPages = locales.flatMap((locale) => [
        {
            alternates: buildAlternates(baseUrl, '', locales),
            changeFrequency: 'weekly' as const,
            lastModified: latestContentDate,
            priority: 1,
            url: buildLocalizedUrl(baseUrl, '', locale),
        },
        {
            alternates: buildAlternates(baseUrl, '/articles', locales),
            changeFrequency: 'weekly' as const,
            lastModified: latestContentDate,
            priority: 0.9,
            url: buildLocalizedUrl(baseUrl, '/articles', locale),
        },
        {
            alternates: buildAlternates(baseUrl, '/experiments', locales),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            url: buildLocalizedUrl(baseUrl, '/experiments', locale),
        },
        {
            alternates: buildAlternates(baseUrl, '/photographs', locales),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
            url: buildLocalizedUrl(baseUrl, '/photographs', locale),
        },
    ]);

    return [...mainPages, ...articleUrls, ...experimentUrls];
}
