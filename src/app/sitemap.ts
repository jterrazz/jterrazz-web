import { type MetadataRoute } from 'next';

import { articlesDataAccess } from '../data/articles.data';
import { experimentsDataAccess } from '../data/experiments.data';
import { buildArticleSlug } from '../lib/slugify';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    const articles = articlesDataAccess.getAll();
    const experiments = experimentsDataAccess.getAll();

    const articleUrls = articles.flatMap((article) => {
        const languages = Object.keys(article.content);
        return languages.map((lang) => ({
            changeFrequency: 'monthly' as const,
            lastModified: new Date(article.metadata.dateModified),
            priority: 0.8,
            url: `${baseUrl}/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}/${lang}`,
        }));
    });

    const experimentUrls = experiments.map((experiment) => ({
        changeFrequency: 'monthly' as const,
        lastModified: new Date(), // Ideally this should come from experiment data
        priority: 0.8,
        url: `${baseUrl}/experiments/${experiment.slug}`,
    }));

    // Add main pages
    const mainPages = [
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: 1.0,
            url: baseUrl,
        },
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: 0.9,
            url: `${baseUrl}/articles`,
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.7,
            url: `${baseUrl}/experiments`,
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.6,
            url: `${baseUrl}/photographs`,
        },
    ];

    return [...mainPages, ...articleUrls, ...experimentUrls];
}
