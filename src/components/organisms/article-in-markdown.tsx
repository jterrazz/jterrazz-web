import React from 'react';
import Markdown from 'markdown-to-jsx';

import { HeadingMain } from '../atoms/typography/heading-main.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';

type ArticleInMarkdownProps = {
    contentInMarkdown: string;
};

export const ArticleInMarkdown: React.FC<ArticleInMarkdownProps> = ({ contentInMarkdown }) => {
    return (
        <article>
            <Markdown
                className="mb-12"
                options={{
                    overrides: {
                        code: {
                            props: {
                                className: 'w-full bg-black-and-white px-1.5 py-1 rounded text-sm',
                            },
                        },
                        h1: {
                            component: HeadingMain,
                            props: {
                                className: 'mb-12 tracking-wide',
                            },
                        },
                        h2: {
                            component: HeadingSection,
                            props: {
                                className: 'mt-8 mb-6 tracking-wide text-3xl',
                            },
                        },
                        h3: {
                            component: HeadingSection,
                            props: {
                                className: 'mt-8 mb-4 tracking-wide text-xl',
                            },
                        },
                        h4: {
                            component: HeadingSection,
                            props: {
                                className: 'mt-8 mb-4',
                            },
                        },
                        img: {
                            props: {
                                className: 'mb-6 mt-6 w-full rounded-2xl',
                            },
                        },
                        li: {
                            props: {
                                className: 'mb-2 ml-6 w-full list-disc',
                            },
                        },
                        p: {
                            props: {
                                className: 'my-3',
                            },
                        },
                        pre: {
                            props: {
                                className:
                                    'my-6 w-100 bg-black-and-white px-6 py-4 rounded-2xl overflow-x-auto',
                            },
                        },
                        ul: {
                            props: {
                                className: 'mb-6',
                            },
                        },
                    },
                }}
            >
                {contentInMarkdown}
            </Markdown>
        </article>
    );
};
