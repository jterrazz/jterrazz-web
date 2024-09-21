'use client';

import React from 'react';
import Link from 'next/link';

import { Article } from '../../domain/article.js';
import { UserContactType } from '../../domain/user.js';

import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';

export const ArticleRow: React.FC<{ article: Article }> = ({ article }) => {
    const color = article.metadata.category === 'code' ? BadgeColor.Green : BadgeColor.Blue;

    return (
        <Link href={`/articles/${article.index}`}>
            <div className="flex items-center justify-between border-b border-color--simple py-3">
                <h3 className="font-medium">{article.metadata.title}</h3>
                <Badge value={article.metadata.category.toUpperCase()} color={color} />
            </div>
        </Link>
    );
};

type ArticlesListTemplateProps = {
    highlightTitle: string;
    highlightDescription: string;
    articles: Article[];
};

// TODO Move to viewmodel
export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({
    articles,
    highlightTitle,
    highlightDescription,
}) => {
    const filteredArticles = articles.filter((article) => article.published);
    const button = {
        href: new UserInMemoryRepository().getContact(UserContactType.Medium).url.toString(),
        text: 'Follow me on Medium',
    };

    return (
        <MainContainer>
            <Highlight title={highlightTitle} description={highlightDescription} button={button} />

            <HeadingSection>
                <HighlightedText className="pr-2">Posts</HighlightedText>
            </HeadingSection>
            {filteredArticles
                .sort(
                    (a, b) =>
                        new Date(b.metadata.datePublished).getTime() -
                        new Date(a.metadata.datePublished).getTime(),
                )
                .map((article) => (
                    <ArticleRow key={article.index} article={article} />
                ))}
        </MainContainer>
    );
};
