'use client';

import React, { type JSX, type ReactNode } from 'react';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import { Highlight, themes } from 'prism-react-renderer';

// Utils
import { cn } from '../../lib/utils';

import { useTheme } from '../../hooks/use-theme';
import { HeadingMain } from '../atoms/typography/heading-main';
import { HeadingSection } from '../atoms/typography/heading-section';

type ArticleInMarkdownProps = {
    className?: string;
    contentInMarkdown: string;
};

const CodeBlock = ({ children, language }: { children: string; language: string }) => {
    const code = children.replace(/^[a-z]+\n/, '');
    const { resolvedTheme } = useTheme();
    const codeTheme = resolvedTheme === 'dark' ? themes.oneDark : themes.oneLight;

    return (
        <div className="my-8 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <Highlight code={code.trim()} language={language} theme={codeTheme}>
                {({ getLineProps, getTokenProps, style, tokens }) => (
                    <pre
                        className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed"
                        style={{
                            ...style,
                            backgroundColor: 'transparent',
                        }}
                    >
                        {tokens.map((line, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: Code tokens don't have stable IDs
                            <div key={i} {...getLineProps({ line })}>
                                <span className="inline-block w-6 select-none text-zinc-300 dark:text-zinc-700 text-[11px] text-right mr-3 opacity-50">
                                    {i + 1}
                                </span>
                                {line.map((token, tokenIndex) => (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Code tokens don't have stable IDs
                                    <span key={tokenIndex} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

export const ArticleInMarkdown: React.FC<ArticleInMarkdownProps> = ({
    className,
    contentInMarkdown,
}) => {
    // Using a serif font stack that mimics Medium/standard publishing typography
    const baseClassName =
        'font-serif text-[19px] leading-[1.58] text-zinc-900 dark:text-zinc-100 antialiased';
    const generatedClassName = cn(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown
                options={{
                    overrides: {
                        a: {
                            props: {
                                className:
                                    'text-zinc-900 dark:text-zinc-100 underline decoration-zinc-400 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-100 decoration-[1px] underline-offset-4 transition-colors',
                            },
                        },
                        blockquote: {
                            props: {
                                className:
                                    'pl-6 border-l-[3px] border-zinc-900 dark:border-zinc-100 italic text-xl text-zinc-700 dark:text-zinc-300 my-10 leading-relaxed',
                            },
                        },
                        code: {
                            component: ({
                                children,
                                className,
                            }: {
                                children: ReactNode;
                                className?: string;
                            }) => {
                                if (className?.includes('inline')) {
                                    return (
                                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono text-pink-600 dark:text-pink-400">
                                            {children}
                                        </code>
                                    );
                                }
                                return children;
                            },
                        },
                        em: {
                            props: {
                                className: 'text-zinc-600 dark:text-zinc-400 italic',
                            },
                        },
                        h1: {
                            component: HeadingMain,
                            props: {
                                className:
                                    'text-4xl md:text-5xl font-sans font-bold tracking-tight mb-8 mt-0 text-zinc-900 dark:text-zinc-50',
                            },
                        },
                        h2: {
                            component: HeadingSection,
                            props: {
                                className:
                                    'text-2xl md:text-3xl font-sans font-bold tracking-tight mb-4 mt-12 text-zinc-900 dark:text-zinc-50',
                            },
                        },
                        h3: {
                            component: HeadingSection,
                            props: {
                                className:
                                    'text-xl md:text-2xl font-sans font-bold tracking-tight mb-3 mt-8 text-zinc-900 dark:text-zinc-50',
                            },
                        },
                        h4: {
                            props: {
                                className:
                                    'text-lg md:text-xl font-sans font-bold mb-2 mt-6 text-zinc-900 dark:text-zinc-50',
                            },
                        },
                        hr: {
                            props: {
                                className:
                                    'my-12 border-none h-[1px] bg-zinc-200 dark:bg-zinc-800 w-1/2 mx-auto',
                            },
                        },
                        img: {
                            component: ({ alt, src, ...props }) => {
                                const altText = (alt as string) || '';
                                return (
                                    <span className="block my-10">
                                        <span className="block rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                            <Image
                                                alt={altText}
                                                className="w-full h-auto"
                                                height={0}
                                                loading="lazy"
                                                sizes="(max-width: 768px) 100vw, 800px"
                                                src={src as string}
                                                style={{ height: 'auto', width: '100%' }}
                                                width={0}
                                                {...props}
                                            />
                                        </span>
                                        {altText && (
                                            <span className="block text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3 font-sans">
                                                {altText}
                                            </span>
                                        )}
                                    </span>
                                );
                            },
                        },
                        li: {
                            props: {
                                className: 'mb-2 ml-4 pl-2',
                            },
                        },
                        ol: {
                            props: {
                                className: 'list-decimal mb-6 pl-5 space-y-2',
                            },
                        },
                        p: {
                            props: {
                                className: 'mb-6 last:mb-0',
                            },
                        },
                        pre: {
                            component: ({ children }: { children: JSX.Element }) => {
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
                                className: 'list-disc mb-6 pl-5 space-y-2 marker:text-zinc-400',
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
