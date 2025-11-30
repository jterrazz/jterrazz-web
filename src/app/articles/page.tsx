import { type Metadata } from 'next';
import Script from 'next/script';

// Infrastructure
import { ArticleInMemoryRepository } from '../../infrastructure/repositories/article-in-memory.repository';
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository';

import { ArticlesListTemplate } from '../../components/templates/articles-list.template';
import { ArticlesListViewModelImpl } from '../../components/templates/articles-list.template.view-model';
import { buildArticleSlug } from '../../lib/slugify';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    },
    description:
        'My personal knowledge base. Notes on engineering, architecture, and the things I learn while building software.',
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
        description:
            'My personal knowledge base. Notes on engineering, architecture, and the things I learn while building software.',
        title: 'Engineering Journal: Notes on Architecture & Systems',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    },
    title: 'Engineering Journal: Notes on Architecture & Systems',
};

export default async function ArticlesPage() {
    const articlesRepository = new ArticleInMemoryRepository();
    const userRepository = new UserInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    // TODO: Move to template directly
    const highlightTitle = 'Articles';
    const highlightDescription =
        'My personal knowledge base. Notes on engineering, architecture, and the things I learn while building software.';

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
        description:
            'My personal knowledge base. Notes on engineering, architecture, and the things I learn while building software.',
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
                url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
            })),
        name: 'Engineering Journal: Notes on Architecture & Systems',
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
