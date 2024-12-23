import React from 'react';
import Markdown from 'markdown-to-jsx';

import { mergeClassName } from '../../lib/utils.js';

import { HeadingMain } from '../atoms/typography/heading-main.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';

type ArticleInMarkdownProps = {
    className?: string;
    contentInMarkdown: string;
};

export const ArticleInMarkdown: React.FC<ArticleInMarkdownProps> = ({
    contentInMarkdown,
    className,
}) => {
    const baseClassName = 'font-["Charter"] text-lg leading-relaxed text-gray-800';
    const generatedClassName = mergeClassName(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown
                options={{
                    overrides: {
                        a: {
                            props: {
                                className: 'text-gray-800 hover:text-blue-600 underline',
                            },
                        },
                        blockquote: {
                            props: {
                                className:
                                    'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600',
                            },
                        },
                        code: {
                            props: {
                                className: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
                            },
                        },
                        em: {
                            props: {
                                className: 'text-gray-500 italic -mt-4 text-center',
                            },
                        },
                        h1: {
                            component: HeadingMain,
                            props: {
                                className: 'text-4xl font-bold mb-8 mt-12',
                            },
                        },
                        h2: {
                            component: HeadingSection,
                            props: {
                                className: 'text-3xl font-bold mb-4 mt-10',
                            },
                        },
                        h3: {
                            component: HeadingSection,
                            props: {
                                className: 'text-2xl font-semibold mb-3 mt-8',
                            },
                        },
                        h4: {
                            props: {
                                className: 'text-xl font-semibold mb-2 mt-6',
                            },
                        },
                        hr: {
                            props: {
                                className: 'my-8',
                            },
                        },
                        img: {
                            component: ({ src, alt, ...props }) => (
                                <img
                                    src={src}
                                    alt={alt}
                                    width={1200}
                                    height={800}
                                    style={{ height: 'auto', width: '100%' }}
                                    loading="lazy"
                                    {...props}
                                />
                            ),
                            props: {
                                className: 'my-8 w-full rounded-lg',
                            },
                        },
                        li: {
                            props: {
                                className: 'mb-2 ml-6',
                            },
                        },
                        ol: {
                            props: {
                                className: 'list-decimal mb-4 pl-5',
                            },
                        },
                        p: {
                            props: {
                                className: 'mb-4',
                            },
                        },
                        pre: {
                            props: {
                                className:
                                    'bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto font-mono text-sm',
                            },
                        },
                        ul: {
                            props: {
                                className: 'list-disc mb-4 pl-5',
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
