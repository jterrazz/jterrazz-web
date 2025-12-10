import Script from 'next/script';

// Domain
import { buildArticleSlug } from '../domain/utils/slugify';

// Infrastructure
import { articlesRepository } from '../infrastructure/repositories/articles.repository';
import { experimentsRepository } from '../infrastructure/repositories/experiments.repository';
import { userRepository } from '../infrastructure/repositories/user.repository';
import { buildMetadata } from '../infrastructure/seo/build-metadata';

import { SITE_CONFIG } from '../config/site';
import { HelloWorldTemplate } from '../presentation/templates/hello-world.template';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const PAGE_DESCRIPTION =
    'Software engineer building AI agents, fintech solutions, and clean architecture systems. Discover my projects, articles, and experiments.';

export const metadata = buildMetadata({
    description: PAGE_DESCRIPTION,
    keywords: [
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
        'intelligent systems',
        'TypeScript',
        'Node.js',
        'Next.js',
        'React',
        'Solidity',
        'self-improvement',
        'personal growth',
        'crypto',
        'blockchain',
    ],
    title: 'Software Engineer & AI Developer',
});

export default function HomePage() {
    const userExperiences = userRepository.getExperiences();
    const allArticles = articlesRepository.getAll();

    // Group articles: series become single items, standalone articles remain individual
    const seriesMap = new Map<string, typeof allArticles>();
    const standaloneArticles: typeof allArticles = [];

    for (const article of allArticles) {
        if (article.metadata.series) {
            const existing = seriesMap.get(article.metadata.series) || [];
            existing.push(article);
            seriesMap.set(article.metadata.series, existing);
        } else {
            standaloneArticles.push(article);
        }
    }

    // Build the final list with dates for sorting
    const topArticlesWithDates: Array<{
        articleCount?: number;
        description: string;
        imageUrl: string;
        latestDate: Date;
        seriesName?: string;
        slug: string;
        title: string;
    }> = [];

    // Add series as single items (use latest article date for sorting, first article for link)
    for (const [seriesName, articles] of seriesMap) {
        const sortedByDateAsc = articles.sort(
            (a, b) =>
                new Date(a.metadata.datePublished).getTime() -
                new Date(b.metadata.datePublished).getTime(),
        );
        const firstArticle = sortedByDateAsc[0];
        const latestArticle = sortedByDateAsc[sortedByDateAsc.length - 1];

        topArticlesWithDates.push({
            articleCount: articles.length,
            description: `${articles.length}-part series exploring ${seriesName.toLowerCase()}.`,
            imageUrl: firstArticle.imageUrl ?? '',
            latestDate: new Date(latestArticle.metadata.dateModified),
            seriesName,
            slug: buildArticleSlug(firstArticle.publicIndex, firstArticle.metadata.title.en),
            title: seriesName,
        });
    }

    // Add standalone articles
    for (const article of standaloneArticles) {
        topArticlesWithDates.push({
            description: article.metadata.description.en,
            imageUrl: article.imageUrl ?? '',
            latestDate: new Date(article.metadata.dateModified),
            slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
            title: article.metadata.title.en,
        });
    }

    // Sort by latest date (newest first) and remove the date field
    const topArticles = topArticlesWithDates
        .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime())
        .map(({ latestDate, ...rest }) => rest);

    // Convert URL instances to plain strings for client components
    const latestExperiments = experimentsRepository
        .getAll()
        .slice(0, 2)
        .map((experiment) => ({
            ...experiment,
            articleUrl: experiment.articleUrl ?? null,
            components: experiment.components.map((component) => ({
                ...component,
                sourceUrl: component.sourceUrl.toString(),
            })),
            url: experiment.url ? experiment.url.toString() : '',
        }));

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        alumniOf: {
            '@type': 'Organization',
            name: '42 Paris',
        },
        description: PAGE_DESCRIPTION,
        hasOccupation: {
            '@type': 'Occupation',
            description:
                'Software engineer specializing in AI agents, clean architecture, and fintech solutions.',
            name: 'Software Engineer',
        },
        image: `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultImage.path}`,
        jobTitle: 'Software Engineer',
        knowsAbout: [
            'AI Agent Development',
            'Fintech Engineering',
            'TypeScript',
            'Node.js',
            'Next.js',
            'React',
            'Solidity',
            'Personal Growth',
        ],
        name: SITE_CONFIG.author.name,
        sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.medium, SITE_CONFIG.social.pexels],
        url: SITE_CONFIG.baseUrl,
        worksFor: {
            '@type': 'Organization',
            name: 'Self-Employed',
        },
    };

    return (
        <>
            <Script id="homepage-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>
            <HelloWorldTemplate
                description={PAGE_DESCRIPTION}
                experiences={userExperiences}
                latestExperiments={latestExperiments}
                topArticles={topArticles}
            />
        </>
    );
}
