'use client';

import React from 'react';
import Link from 'next/link';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';
import { Highlight } from '../molecules/typography/highlight.jsx';
import { MainContainer } from '../organisms/main-container.jsx';

import {
    type ArticleRowViewModel,
    type ArticlesListViewModel,
} from './articles-list.template.view-model.jsx';

export const ArticleRow: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    const color = article.isCodeCategory ? BadgeColor.Green : BadgeColor.Blue;

    return (
        <Link href={`/articles/${article.index}`}>
            <div className="flex items-center justify-between border-b border-black-and-white py-3">
                <h3 className="font-medium">{article.title}</h3>
                <Badge color={color} value={article.category} />
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
                button={viewModel.button}
                description={viewModel.highlightDescription}
                title={viewModel.highlightTitle}
            />

            <HeadingSection>
                <HighlightedText className="pr-2">Posts</HighlightedText>
            </HeadingSection>

            {viewModel.articles.map((article) => (
                <ArticleRow article={article} key={article.index} />
            ))}
        </MainContainer>
    );
};
