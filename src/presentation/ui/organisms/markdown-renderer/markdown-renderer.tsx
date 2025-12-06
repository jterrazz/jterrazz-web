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
        <div className="my-8 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <Highlight code={code} language={language} theme={codeTheme}>
                {({ getLineProps, getTokenProps, style, tokens }) => (
                    <pre
                        className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-normal"
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
                                    <span className="inline-block w-6 select-none text-zinc-300 dark:text-zinc-700 text-[10px] md:text-xs text-right mr-3 opacity-50">
                                        {i + 1}
                                    </span>
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
        'font-serif text-lg md:text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 antialiased';
    const generatedClassName = cn(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-400 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-100 decoration-[1px] underline-offset-4 transition-colors"
                            {...props}
                        />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="pl-6 border-l-[3px] border-zinc-900 dark:border-zinc-100 italic text-lg md:text-xl text-zinc-700 dark:text-zinc-300 my-10 leading-relaxed"
                            {...props}
                        />
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code
                                    className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono text-pink-600 dark:text-pink-400"
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
                    em: ({ node, ...props }) => (
                        <em className="text-zinc-600 dark:text-zinc-400 italic" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                        <HeadingH1
                            className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight mb-8 mt-0 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <HeadingH2
                            className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold tracking-tight mb-4 mt-12 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <HeadingH2
                            className="text-xl md:text-2xl lg:text-3xl font-sans font-bold tracking-tight mb-3 mt-8 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4
                            className="text-lg md:text-xl lg:text-2xl font-sans font-bold mb-2 mt-6 text-zinc-900 dark:text-zinc-50"
                            {...props}
                        />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr
                            className="my-12 border-none h-[1px] bg-zinc-200 dark:bg-zinc-800 w-1/2 mx-auto"
                            {...props}
                        />
                    ),
                    img: ({ alt, height, src, width, ...props }) => {
                        const altText = (alt as string) || '';
                        return (
                            <span className="block my-10">
                                <span className="block rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
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
                                    <span className="block text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3 font-sans">
                                        {altText}
                                    </span>
                                )}
                            </span>
                        );
                    },
                    li: ({ node, ...props }) => <li className="mb-2 ml-4 pl-2" {...props} />,
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal mb-6 pl-5 space-y-2" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="mb-6 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => (
                        <ul
                            className="list-disc mb-6 pl-5 space-y-2 marker:text-zinc-400"
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
