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
    return (
        <MainContainer>
            <Highlight
                title={viewModel.highlightTitle}
                description={viewModel.highlightDescription}
                button={viewModel.button}
            />

            <HeadingSection>
                <HighlightedText className="pr-2">Posts</HighlightedText>
            </HeadingSection>

            {viewModel.articles.map((article) => (
                <ArticleRow key={article.index} article={article} />
            ))}
        </MainContainer>
    );
};
