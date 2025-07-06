import React from 'react';
import { type Metadata } from 'next';
import Script from 'next/script';

import { ArticleInMemoryRepository } from '../../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { ArticlesListTemplate } from '../../components/templates/articles-list.template.js';
import { ArticlesListViewModelImpl } from '../../components/templates/articles-list.template.view-model.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    },
    description: 'Read articles by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Deep dives into AI, fintech, and building intelligent systems for personal and financial growth.',
    keywords: [
        'AI articles',
        'fintech insights',
        'intelligent systems',
        'personal growth',
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
    ],
    openGraph: {
        description: 'Read articles by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer.',
        title: 'Articles by Jean-Baptiste Terrazzoni: AI & Fintech Insights',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    },
    title: 'Articles by Jean-Baptiste Terrazzoni: AI & Fintech Insights',
};

export default async function ArticlesPage() {
    const articlesRepository = new ArticleInMemoryRepository();
    const userRepository = new UserInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    // TODO: Move to template directly
    const highlightTitle = 'Articles';
    const highlightDescription =
        'Dive into my articles. From coding and new product concepts, explore new things.';

    const viewModel = new ArticlesListViewModelImpl(
        articles,
        highlightTitle,
        highlightDescription,
        userRepository,
    );

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: 'Read articles by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Deep dives into AI, fintech, and building intelligent systems for personal and financial growth.',
        hasPart: articles
            .filter((article) => article.published)
            .map((article) => ({
                '@type': 'BlogPosting',
                author: {
                    '@type': 'Person',
                    name: 'Jean-Baptiste Terrazzoni',
                    url: 'https://jterrazz.com',
                },
                dateModified: new Date(article.metadata.dateModified).toISOString(),
                datePublished: new Date(article.metadata.datePublished).toISOString(),
                description: article.metadata.description,
                inLanguage: Object.keys(article.content),
                name: article.metadata.title,
                url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles/${article.publicIndex}`,
            })),
        name: 'Articles by Jean-Baptiste Terrazzoni: AI & Fintech Insights',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    };

    return (
        <>
            <Script id="articles-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>
            <ArticlesListTemplate viewModel={viewModel.getViewModel()} />
        </>
    );
}
