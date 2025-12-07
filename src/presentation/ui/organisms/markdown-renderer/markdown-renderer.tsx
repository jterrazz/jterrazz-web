'use client';

import React from 'react';

import Image from 'next/image';
import { Highlight, themes } from 'prism-react-renderer';
import Markdown from 'react-markdown';

// Utils
import { cn } from '../../../utils';

import { useTheme } from '../../../hooks/use-theme';
import { HeadingH1 } from '../../atoms/heading-h1/heading-h1';
import { HeadingH2 } from '../../atoms/heading-h2/heading-h2';

type MarkdownRendererProps = {
    className?: string;
    content: string;
};

const normalizeLanguage = (language?: string) => {
    if (!language) return 'typescript';
    const lang = language.toLowerCase();
    const mapping: Record<string, string> = {
        js: 'javascript',
        sh: 'bash',
        shell: 'bash',
        ts: 'typescript',
    };
    return mapping[lang] || lang;
};

const CodeBlock = ({ children, language }: { children: string; language: string }) => {
    const code = children.replace(/^\n+|\n+$/g, '');
    const { resolvedTheme } = useTheme();
    const codeTheme = resolvedTheme === 'dark' ? themes.oneDark : themes.oneLight;

    return (
        <div className="my-8 md:my-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <Highlight code={code} language={language} theme={codeTheme}>
                {({ getLineProps, getTokenProps, style, tokens }) => (
                    <pre
                        className="p-4 md:p-5 overflow-x-auto text-[13px] md:text-sm font-mono leading-relaxed"
                        style={{
                            ...style,
                            backgroundColor: 'transparent',
                            whiteSpace: 'pre',
                        }}
                    >
                        {tokens.map((line, i) => {
                            const { style: lineStyle, ...lineProps } = getLineProps({ line });
                            return (
                                <div
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Code tokens don't have stable IDs
                                    key={i}
                                    {...lineProps}
                                    style={{ ...lineStyle, whiteSpace: 'pre' }}
                                >
                                    {line.map((token, tokenIndex) => (
                                        <span
                                            // biome-ignore lint/suspicious/noArrayIndexKey: Code tokens don't have stable IDs
                                            key={tokenIndex}
                                            {...getTokenProps({ token })}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ className, content }) => {
    const baseClassName =
        'font-serif text-[17px] md:text-[20px] leading-[1.7] md:leading-[1.8] text-zinc-800 dark:text-zinc-200 antialiased';
    const generatedClassName = cn(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-zinc-500 dark:hover:decoration-zinc-400 underline-offset-2 transition-colors"
                            {...props}
                        />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="pl-5 md:pl-6 border-l-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 my-8 md:my-10"
                            {...props}
                        />
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code
                                    className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[0.9em] font-mono text-zinc-800 dark:text-zinc-200"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        const language = normalizeLanguage(match?.[1]);
                        return (
                            <CodeBlock language={language}>
                                {String(children).replace(/\n$/, '')}
                            </CodeBlock>
                        );
                    },
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    h1: ({ node, ...props }) => (
                        <HeadingH1
                            className="text-[28px] md:text-[40px] lg:text-[48px] font-sans font-bold tracking-tight leading-[1.2] mb-6 md:mb-8 mt-0 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <HeadingH2
                            className="text-[22px] md:text-[28px] lg:text-[32px] font-sans font-bold tracking-tight leading-[1.3] mb-4 mt-12 md:mt-14 first:mt-0 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <HeadingH2
                            className="text-[18px] md:text-[22px] lg:text-[26px] font-sans font-semibold tracking-tight leading-[1.3] mb-3 mt-10 md:mt-12 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4
                            className="text-[16px] md:text-[18px] font-sans font-semibold leading-[1.4] mb-2 mt-8 md:mt-10 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr
                            className="my-10 md:my-14 border-none text-center before:content-['···'] before:text-2xl before:tracking-[0.5em] before:text-zinc-300 dark:before:text-zinc-600"
                            {...props}
                        />
                    ),
                    img: ({ alt, height, src, width, ...props }) => {
                        const altText = (alt as string) || '';
                        return (
                            <span className="block my-8 md:my-12">
                                <span className="block rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                    <Image
                                        alt={altText}
                                        className="w-full h-auto"
                                        height={typeof height === 'number' ? height : 0}
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                        src={src as string}
                                        style={{ height: 'auto', width: '100%' }}
                                        width={typeof width === 'number' ? width : 0}
                                        {...props}
                                    />
                                </span>
                                {altText && (
                                    <span className="block text-center text-[14px] text-zinc-500 dark:text-zinc-500 mt-3 font-sans">
                                        {altText}
                                    </span>
                                )}
                            </span>
                        );
                    },
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    ol: ({ node, ...props }) => (
                        <ol
                            className="list-decimal mb-6 md:mb-7 pl-6 space-y-2 md:space-y-3"
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => <p className="mb-6 md:mb-7 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => (
                        <ul
                            className="list-disc mb-6 md:mb-7 pl-6 space-y-2 md:space-y-3 marker:text-zinc-400 dark:marker:text-zinc-500"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </Markdown>
        </article>
    );
};
