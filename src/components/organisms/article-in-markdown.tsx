import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Highlight, themes } from 'prism-react-renderer';

import { cn } from '../../lib/utils.js';

import { HeadingMain } from '../atoms/typography/heading-main.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';

type ArticleInMarkdownProps = {
    className?: string;
    contentInMarkdown: string;
};

const CodeBlock = ({ children, language }: { children: string; language: string }) => {
    const code = children.replace(/^[a-z]+\n/, '');

    return (
        <Highlight code={code.trim()} language={language} theme={themes.oneLight}>
            {({ getLineProps, getTokenProps, style, tokens }) => (
                <pre
                    className="p-4 rounded-lg my-6 overflow-x-auto text-sm whitespace-pre-wrap -mx-4"
                    style={style}
                >
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};

export const ArticleInMarkdown: React.FC<ArticleInMarkdownProps> = ({
    className,
    contentInMarkdown,
}) => {
    const baseClassName = 'font-["Charter"] text-base md:text-lg leading-relaxed text-gray-800';
    const generatedClassName = cn(baseClassName, className);

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
                            component: ({ children, className }) => {
                                // If it's an inline code block (not wrapped in pre)
                                if (className?.includes('inline')) {
                                    return (
                                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                                            {children}
                                        </code>
                                    );
                                }

                                // Otherwise, just render the children to be handled by pre
                                return children;
                            },
                        },
                        em: {
                            props: {
                                className: 'text-gray-500 italic -mt-4',
                            },
                        },
                        h1: {
                            component: HeadingMain,
                            props: {
                                className: 'text-3xl md:text-4xl font-bold mb-8 mt-12',
                            },
                        },
                        h2: {
                            component: HeadingSection,
                            props: {
                                className: 'text-2xl md:text-3xl font-bold mb-4 mt-10',
                            },
                        },
                        h3: {
                            component: HeadingSection,
                            props: {
                                className: 'text-xl md:text-2xl font-semibold mb-3 mt-8',
                            },
                        },
                        h4: {
                            props: {
                                className: 'text-lg md:text-xl font-semibold mb-2 mt-6',
                            },
                        },
                        hr: {
                            props: {
                                className: 'my-8',
                            },
                        },
                        img: {
                            component: ({ alt, src, ...props }) => (
                                <img
                                    alt={alt}
                                    height={800}
                                    loading="lazy"
                                    src={src}
                                    style={{ height: 'auto', width: '100%' }}
                                    width={1200}
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
                            component: ({ children }) => {
                                const language =
                                    children?.props?.className?.split('-')[1] || 'typescript';

                                return (
                                    <CodeBlock language={language}>
                                        {children.props.children}
                                    </CodeBlock>
                                );
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
