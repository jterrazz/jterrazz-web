import React from 'react';
import Markdown from 'markdown-to-jsx';

import { DotPulseState } from '../atoms/status/DotPulse.jsx';
import { HeadingMain } from '../atoms/typography/Heading.Main.jsx';
import { HeadingSection } from '../atoms/typography/Heading.Section.jsx';
import { ResourceCard } from '../molecules/card/ResourceCard.jsx';
import { HorizontalCards } from '../organisms/HorizontalCards.jsx';

type BlogArticleProps = {
    // article: PostArticle;
    article: string;
};

const resources = [
    {
        description: 'Link on medium 1',
        state: DotPulseState.Disabled, // TODO Remove
        title: 'Link on medium 1',
        url: 'https://medium.com/',
    },
];

export const ArticleTemplate: React.FC<BlogArticleProps> = ({ article }) => {
    return (
        <main
            className="w-full flex flex-col self-center justify-self-center"
            style={{
                maxWidth: 740,
            }}
        >
            <Markdown
                options={{
                    overrides: {
                        h1: {
                            component: HeadingMain,
                            // props: {
                            // className: 'foo',
                            // },
                        },
                    },
                }}
            >
                {article}
            </Markdown>

            <HeadingSection className="mb-6" title="Resources" />
            <div className="-ml-4">
                <HorizontalCards>
                    {resources.map((resource, index) => (
                        <ResourceCard resource={resource} highlighted={index === 0} />
                    ))}
                </HorizontalCards>
            </div>
        </main>
    );
};
