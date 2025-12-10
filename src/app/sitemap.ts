import { type MetadataRoute } from 'next';

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

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    const articles = articlesRepository.getAll();
    const experiments = experimentsRepository.getAll();

    // Generate article URLs for all locales where content exists
    const articleUrls = articles.flatMap((article) => {
        const languages = Object.keys(article.content);
        return languages
            .filter((lang) => locales.includes(lang as (typeof locales)[number]))
            .map((lang) => ({
                changeFrequency: 'monthly' as const,
                lastModified: new Date(article.metadata.dateModified),
                priority: 0.8,
                url: buildLocalizedUrl(
                    baseUrl,
                    `/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
                    lang,
                ),
            }));
    });

    // Generate experiment URLs for all locales
    const experimentUrls = experiments.flatMap((experiment) =>
        locales.map((locale) => ({
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.8,
            url: buildLocalizedUrl(baseUrl, `/experiments/${experiment.slug}`, locale),
        })),
    );

    // Main pages for all locales
    const mainPages = locales.flatMap((locale) => [
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: locale === 'en' ? 1.0 : 0.9,
            url: buildLocalizedUrl(baseUrl, '', locale),
        },
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: 0.9,
            url: buildLocalizedUrl(baseUrl, '/articles', locale),
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.7,
            url: buildLocalizedUrl(baseUrl, '/experiments', locale),
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.6,
            url: buildLocalizedUrl(baseUrl, '/photographs', locale),
        },
    ]);

    return [...mainPages, ...articleUrls, ...experimentUrls];
}
