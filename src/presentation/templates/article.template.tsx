import React from 'react';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';
import { Container } from '../ui/design-system';
import { ArticleByline } from '../ui/molecules/article-byline/article-byline';
import { TableOfContents } from '../ui/molecules/table-of-contents/table-of-contents';
import { ArticleFooter } from '../ui/organisms/article-footer/article-footer';
import { ArticleHeader } from '../ui/organisms/article-header/article-header';
import { MarkdownRenderer } from '../ui/organisms/markdown-renderer/markdown-renderer';
import { buildArticleTemplateViewModel } from './article-template-view-model';

const ON_THIS_PAGE_LABEL: Record<ArticleLanguage, string> = {
    en: 'On this page',
    fr: 'Sur cette page',
};

type ArticleTemplateProps = {
    articleId: string;
    articles: Article[];
    contentInMarkdown: string;
    currentLanguage: ArticleLanguage;
    dateModified: string;
    datePublished: string;
    description: string;
    features: Feature[];
    imageUrl?: string;
    linkedExperiment?: null | { name: string; slug: string };
    title: string;
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
    articleId,
    articles,
    contentInMarkdown,
    currentLanguage,
    dateModified,
    datePublished,
    description,
    imageUrl,
    linkedExperiment,
    title,
}) => {
    const viewModel = buildArticleTemplateViewModel({ articleId, articles, contentInMarkdown });

    return (
        <Container className="mt-10 md:mt-20 pb-16 md:pb-24 relative" width="wide">
            <ArticleHeader
                className="mb-10 md:mb-14"
                description={description}
                experiment={linkedExperiment}
                imageUrl={imageUrl}
                locale={currentLanguage}
                nextHref={viewModel.nextHref}
                prevHref={viewModel.prevHref}
                seriesName={viewModel.seriesName}
                seriesPosition={viewModel.seriesPosition}
                seriesTotal={viewModel.seriesTotal}
                title={title}
            />

            <div className="md:mx-auto md:grid md:max-w-[70rem] md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-20 lg:gap-x-32">
                <aside className="mb-10 md:mb-0">
                    <ArticleByline
                        className="mb-6 md:mb-10"
                        datePublished={datePublished}
                        locale={currentLanguage}
                        readingTimeMinutes={viewModel.readingTimeMinutes}
                    />
                    {/* The sticky rail has no room on a phone, so the same
                        outline ships as a closed disclosure above the body. */}
                    <TableOfContents
                        className="md:hidden"
                        contentInMarkdown={viewModel.body}
                        label={ON_THIS_PAGE_LABEL[currentLanguage]}
                        variant="collapsible"
                    />
                    <TableOfContents
                        className="hidden md:block md:sticky md:top-28"
                        contentInMarkdown={viewModel.body}
                        label={ON_THIS_PAGE_LABEL[currentLanguage]}
                        variant="sidebar"
                    />
                </aside>

                <MarkdownRenderer content={viewModel.body} />

                <ArticleFooter
                    articleUrl={viewModel.attestation ? `/articles/${articleId}` : undefined}
                    attestation={viewModel.attestation}
                    className="mt-12 md:mt-16 md:col-start-2"
                    currentArticleId={articleId}
                    dateModified={dateModified}
                    datePublished={datePublished}
                    relatedArticles={viewModel.relatedArticles}
                    seriesTitle={viewModel.seriesName}
                />
            </div>
        </Container>
    );
};
