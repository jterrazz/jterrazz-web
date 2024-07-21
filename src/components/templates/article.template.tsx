import React from 'react';

import { Feature } from '../../domain/feature.js';

import { ArticleInMarkdown } from '../organisms/article-in-markdown.js';
import { MainContainer } from '../organisms/main-container.jsx';

type ArticleTemplateProps = {
    contentInMarkdown: string;
    features: Feature[];
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ contentInMarkdown }) => {
    return (
        <MainContainer className="mt-0">
            <ArticleInMarkdown contentInMarkdown={contentInMarkdown} />
        </MainContainer>
    );
};
