import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { type ArticleLanguage } from '../../../domain/article.js';

import { ArticleInMemoryRepository } from '../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeaturedId } from '../../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../components/templates/article.template.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

type ArticlePageProps = {
    params: Promise<{ id: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;

    const { id } = params;

    const featureRepository = new FeatureInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();

    const article = await articlesRepository.getArticleByIndex(id);
    const articles = await articlesRepository.getArticles();
    const features = [featureRepository.getFeatureById(FeaturedId.Source)];

    if (!article) {
        return notFound();
    }

    return (
        <ArticleTemplate
            articleId={id}
            articles={articles.filter((a) => a.publicIndex !== article.publicIndex)}
            availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
            contentInMarkdown={article.content['en']!}
            currentLanguage={'en'}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            features={features}
            title={article.metadata.title}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const id = params.id;
    const articlesRepository = new ArticleInMemoryRepository();
    const article = await articlesRepository.getArticleByIndex(id);

    if (!article) {
        return {
            title: 'Article Not Found ~ Jterrazz',
        };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    // Generate hreflang links for all available languages
    const alternates: Record<string, string> = {};
    availableLanguages.forEach((language) => {
        alternates[language] = `${baseUrl}/articles/${id}/${language}`;
    });

    return {
        alternates: {
            canonical: `${baseUrl}/articles/${id}/en`, // Default to English
            languages: alternates,
        },
        description: article.metadata.description,
        openGraph: {
            alternateLocale: availableLanguages.filter((l) => l !== 'en'),
            description: article.metadata.description,
            locale: 'en',
            title: article.metadata.title,
            url: `${baseUrl}/articles/${id}/en`,
        },
        title: article.metadata.title + ' ~ Jterrazz',
    };
}

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    return articles.map((article) => {
        return { id: String(article.publicIndex) };
    });
}
