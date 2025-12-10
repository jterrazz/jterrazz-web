import Script from 'next/script';

// Domain
import { buildArticleSlug } from '../../domain/utils/slugify';

// Infrastructure
import { articlesRepository } from '../../infrastructure/repositories/articles.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';

import { ArticlesListViewModelImpl } from '../../presentation/templates/articles-list-template-view-model';
import { ArticlesListTemplate } from '../../presentation/templates/articles-list.template';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const PAGE_DESCRIPTION =
    'Technical articles on AI agents, clean architecture, TypeScript, and software engineering best practices. In-depth guides and tutorials.';

export const metadata = buildMetadata({
    description: PAGE_DESCRIPTION,
    keywords: [
        'AI articles',
        'fintech insights',
        'intelligent systems',
        'personal growth',
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
    ],
    path: '/articles',
    title: 'Articles',
});

export default function ArticlesPage() {
    const articles = articlesRepository.getAll();

    // TODO: Move to template directly
    const highlightTitle = 'Articles';
    const highlightDescription =
        'My personal knowledge base. Notes on engineering, architecture, and the things I learn while building software.';

    const viewModel = new ArticlesListViewModelImpl(articles, highlightTitle, highlightDescription);

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: PAGE_DESCRIPTION,
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
                description: article.metadata.description.en,
                inLanguage: Object.keys(article.content),
                name: article.metadata.title.en,
                url: `${metadata.openGraph?.url}/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
            })),
        name: 'Articles by Jean-Baptiste Terrazzoni',
        url: metadata.openGraph?.url,
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
