// Domain
import { buildArticleSlug } from '../../domain/utils/slugify';

// Infrastructure
import { articlesRepository } from '../../infrastructure/repositories/articles.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';
import {
    buildBlogPostingJsonLd,
    buildCollectionPageJsonLd,
} from '../../infrastructure/seo/json-ld';

import { ArticlesListViewModelImpl } from '../../presentation/templates/articles-list-template-view-model';
import { ArticlesListTemplate } from '../../presentation/templates/articles-list.template';
import { JsonLdScript } from '../../presentation/ui/atoms/json-ld-script/json-ld-script';

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

    const pageUrl = metadata.openGraph?.url as string;
    const jsonLd = buildCollectionPageJsonLd({
        description: PAGE_DESCRIPTION,
        items: articles
            .filter((article) => article.published)
            .map((article) =>
                buildBlogPostingJsonLd({
                    dateModified: new Date(article.metadata.dateModified).toISOString(),
                    datePublished: new Date(article.metadata.datePublished).toISOString(),
                    description: article.metadata.description.en,
                    languages: Object.keys(article.content),
                    title: article.metadata.title.en,
                    url: `${pageUrl}/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
                }),
            ),
        name: 'Articles by Jean-Baptiste Terrazzoni',
        url: pageUrl,
    });

    return (
        <>
            <JsonLdScript data={jsonLd} id="articles-json-ld" />
            <ArticlesListTemplate viewModel={viewModel.getViewModel()} />
        </>
    );
}
