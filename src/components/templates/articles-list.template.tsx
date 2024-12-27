'use client';

import React from 'react';
import Link from 'next/link';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';
import { Highlight } from '../molecules/typography/highlight.jsx';
import { MainContainer } from '../organisms/main-container.jsx';

import {
    ArticleRowViewModel,
    ArticlesListViewModel,
} from './articles-list.template.view-model.jsx';

export const ArticlePreview: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    return (
        <Link href={`/articles/${article.index}`}>
            <div className="group flex flex-col space-y-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                        src="https://cdn.jsdelivr.net/gh/jterrazz/jterrazz-web@main/content/articles/2024-12-22%20Learn%20Application%20Design%20-%20Hexagonal/assets/thumbnail.jpg"
                        alt={article.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <h3 className="font-medium line-clamp-2">{article.title}</h3>
                    <Badge
                        value={article.category}
                        color={article.isCodeCategory ? BadgeColor.Green : BadgeColor.Blue}
                        className="ml-4 shrink-0"
                    />
                </div>
            </div>
        </Link>
    );
};

export const ArticleRow: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    const color = article.isCodeCategory ? BadgeColor.Green : BadgeColor.Blue;

    return (
        <Link href={`/articles/${article.index}`}>
            <div className="flex items-center justify-between border-b border-black-and-white py-3">
                <h3 className="font-medium">{article.title}</h3>
                <Badge value={article.category} color={color} />
            </div>
        </Link>
    );
};

type ArticlesListTemplateProps = {
    viewModel: ArticlesListViewModel;
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({ viewModel }) => {
    const latestArticles = viewModel.articles.slice(0, 2);
    const remainingArticles = viewModel.articles.slice(2);

    return (
        <MainContainer>
            <Highlight
                title={viewModel.highlightTitle}
                description={viewModel.highlightDescription}
                button={viewModel.button}
            />

            <HeadingSection>
                <HighlightedText className="pr-2">Latest</HighlightedText>
            </HeadingSection>

            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {latestArticles.map((article) => (
                    <ArticlePreview key={article.index} article={article} />
                ))}
            </div>

            <HeadingSection>
                <HighlightedText className="pr-2">Posts</HighlightedText>
            </HeadingSection>

            {remainingArticles.map((article) => (
                <ArticleRow key={article.index} article={article} />
            ))}
        </MainContainer>
    );
};
