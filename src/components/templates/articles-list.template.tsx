'use client';

import React from 'react';
import Link from 'next/link';

import { Article } from '../../domain/article.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';

type ArticlesListTemplateProps = {
    highlightTitle: string;
    highlightDescription: string;
    articles: Article[];
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({
    articles,
    highlightTitle,
    highlightDescription,
}) => {
    const filteredArticles = articles.filter((article) => article.published);

    const ArticleRow: React.FC<{ article: Article }> = ({ article }) => (
        <Link href={`/articles/${article.index}`}>
            <div className="flex items-center justify-between border-b border-black-and-white py-3">
                <h3 className="font-medium">{article.metadata.title}</h3>
                <p className="text-storm-cloud w-32 text-right">
                    {article.metadata.category.toUpperCase()} ~{' '}
                    {new Date(article.metadata.date).getFullYear()}
                </p>
            </div>
        </Link>
    );

    return (
        <MainContainer>
            <Highlight title={highlightTitle} description={highlightDescription} />

            <HeadingSection>
                <HighlightedText className="pr-2">Posts</HighlightedText>
            </HeadingSection>
            {filteredArticles.map((article) => (
                <ArticleRow key={article.index} article={article} />
            ))}
        </MainContainer>
    );
};
