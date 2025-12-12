import { getTranslations, setRequestLocale } from 'next-intl/server';

import { buildArticleSlug } from '../../domain/utils/slugify';

import { articlesRepository } from '../../infrastructure/repositories/articles.repository';
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';
import { buildPersonJsonLd } from '../../infrastructure/seo/json-ld';

import type { Locale } from '../../i18n/config';
import { HelloWorldTemplate } from '../../presentation/templates/hello-world.template';
import { JsonLdScript } from '../../presentation/ui/atoms/json-ld-script/json-ld-script';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'home' });

    return buildMetadata({
        alternateLanguages: {
            en: '/',
            fr: '/fr',
        },
        description: t('description'),
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
        locale,
        path: locale === 'en' ? '' : `/${locale}`,
        title: t('seoTitle'),
    });
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'home' });

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
            description: t('seriesDescription', {
                count: articles.length,
                name: seriesName.toLowerCase(),
            }),
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
            description:
                article.metadata.description[locale as Locale] ?? article.metadata.description.en,
            imageUrl: article.imageUrl ?? '',
            latestDate: new Date(article.metadata.dateModified),
            slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
            title: article.metadata.title[locale as Locale] ?? article.metadata.title.en,
        });
    }

    // Sort by latest date (newest first) and remove the date field
    const topArticles = topArticlesWithDates
        .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime())
        .map(({ latestDate, ...rest }) => rest);

    // Featured experiments - specific selection
    const featuredSlugs = ['capitaine', 'n00', 'jterrazz'];
    const featuredExperiments = featuredSlugs
        .map((slug) => experimentsRepository.getBySlug(slug))
        .filter((exp) => exp !== undefined)
        .map((experiment) => ({
            ...experiment,
            articleUrl: experiment.articleUrl ?? null,
            components: experiment.components.map((component) => ({
                ...component,
                sourceUrl: component.sourceUrl.toString(),
            })),
            url: experiment.url ? experiment.url.toString() : '',
        }));

    const jsonLd = buildPersonJsonLd({ description: t('description') });

    // Translations for client component
    const translations = {
        focus: t('focus'),
        focusAreas: {
            aiAgents: {
                description: t('focusAreas.aiAgents.description'),
                title: t('focusAreas.aiAgents.title'),
            },
            aiEngineering: {
                description: t('focusAreas.aiEngineering.description'),
                title: t('focusAreas.aiEngineering.title'),
            },
            architecture: {
                description: t('focusAreas.architecture.description'),
                title: t('focusAreas.architecture.title'),
            },
            decentralization: {
                description: t('focusAreas.decentralization.description'),
                title: t('focusAreas.decentralization.title'),
            },
        },
        journey: t('journey'),
        featuredExperiments: t('featuredExperiments'),
        latestArticles: t('latestArticles'),
        readArticles: t('readArticles'),
        title: t('title'),
        viewAll: t('viewAll'),
    };

    return (
        <>
            <JsonLdScript data={jsonLd} id="homepage-json-ld" />
            <HelloWorldTemplate
                description={t('description')}
                experiences={userExperiences}
                featuredExperiments={featuredExperiments}
                topArticles={topArticles}
                translations={translations}
            />
        </>
    );
}
