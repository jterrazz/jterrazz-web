import React from 'react';

import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// Domain
import { type ArticleLanguage } from '../../../domain/article.js';

// Infrastructure
import { ArticleInMemoryRepository } from '../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeaturedId } from '../../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../components/templates/article.template.js';
import { buildArticleSlug } from '../../../lib/slugify.js';

export const dynamicParams = true;

type ArticlePageProps = {
    params: Promise<{ slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const { slugId } = params;

    // Extract the numeric id prefix before the first dash
    const id = slugId.split('-')[0];

    const featureRepository = new FeatureInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();

    const article = await articlesRepository.getArticleByIndex(id);

    if (!article) {
        return notFound();
    }

    // Compute canonical slug and redirect if needed
    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
    if (slugId !== canonicalSlug) {
        return redirect(`/articles/${canonicalSlug}`);
    }

    const articles = await articlesRepository.getArticles();
    const features = [featureRepository.getFeatureById(FeaturedId.Source)];

    return (
        <ArticleTemplate
            articleId={slugId}
            articles={articles.filter((a) => a.publicIndex !== article.publicIndex)}
            availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
            contentInMarkdown={article.content['en']!}
            currentLanguage={'en'}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            features={features}
            title={article.metadata.title['en']}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { slugId } = params;
    const id = slugId.split('-')[0];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    const articlesRepository = new ArticleInMemoryRepository();
    const article = await articlesRepository.getArticleByIndex(id);

    if (!article) {
        return {
            title: 'Article Not Found ~ Jterrazz',
        };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

    const thumbnailUrl = article.imageUrl
        ? `${baseUrl}${article.imageUrl}`
        : `${baseUrl}/assets/icons/app-icon.jterrazz.png`;

    // Generate hreflang links for all available languages
    const alternates: Record<string, string> = {};
    availableLanguages.forEach((language) => {
        alternates[language] = `${baseUrl}/articles/${slugId}/${language}`;
    });

    return {
        alternates: {
            canonical: `${baseUrl}/articles/${slugId}/en`, // Default to English
            languages: alternates,
        },
        description: article.metadata.description['en'],
        openGraph: {
            alternateLocale: availableLanguages.filter((l) => l !== 'en'),
            description: article.metadata.description['en'],
            images: [
                {
                    alt: article.metadata.title['en'],
                    height: 630,
                    url: thumbnailUrl,
                    width: 1200,
                },
            ],
            locale: 'en',
            title: article.metadata.title['en'],
            url: `${baseUrl}/articles/${slugId}/en`,
        },
        title: `${article.metadata.title['en']} ~ Jterrazz`,
    };
}

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    return articles.flatMap((article) => [
        { slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en) },
        { slugId: String(article.publicIndex) },
    ]);
}
