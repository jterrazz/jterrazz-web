'use client';

import React from 'react';

import Image from 'next/image';
import { Highlight, themes } from 'prism-react-renderer';
import Markdown from 'react-markdown';

// Domain
import { slugify } from '../../../../domain/utils/slugify';

// Utils
import { cn } from '../../../utils';

import { useTheme } from '../../../hooks/use-theme';

// Helper to extract text content from React children
const getTextContent = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(getTextContent).join('');
    if (React.isValidElement(children) && children.props?.children) {
        return getTextContent(children.props.children);
    }
    return '';
};

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
        <div className="my-7 md:my-9 -mx-4 md:mx-0 md:rounded-xl overflow-hidden bg-[#fafafa] dark:bg-[#141414]">
            <Highlight code={code} language={language} theme={codeTheme}>
                {({ getLineProps, getTokenProps, style, tokens }) => (
                    <pre
                        className="px-4 py-4 md:px-6 md:py-5 overflow-x-auto text-[13px] md:text-[14px] font-mono leading-[1.7]"
                        style={{
                            ...style,
                            backgroundColor: 'transparent',
                            whiteSpace: 'pre',
                            tabSize: 4,
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
    // Medium-inspired typography: 17px mobile, 20px desktop, comfortable line height
    const baseClassName =
        'font-serif text-[17px] md:text-[20px] leading-[1.6] md:leading-[1.7] text-zinc-700 dark:text-zinc-300 antialiased';
    const generatedClassName = cn(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-zinc-600 dark:hover:decoration-zinc-300 underline-offset-[3px] transition-colors duration-150"
                            {...props}
                        />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="pl-5 md:pl-7 border-l-[3px] border-zinc-300 dark:border-zinc-600 italic text-[16px] md:text-[19px] text-zinc-600 dark:text-zinc-400 my-7 md:my-9 leading-[1.6]"
                            {...props}
                        />
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code
                                    className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[0.88em] font-mono text-zinc-800 dark:text-zinc-200"
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
                    h1: ({ node, children, ...props }) => {
                        const text = getTextContent(children);
                        const id = slugify(text);
                        return (
                            <h1
                                className="text-[26px] md:text-[32px] lg:text-[36px] font-sans font-bold tracking-[-0.02em] leading-[1.2] mb-5 md:mb-6 mt-0 text-zinc-900 dark:text-zinc-50"
                                id={id}
                                {...props}
                            >
                                {children}
                            </h1>
                        );
                    },
                    h2: ({ node, children, ...props }) => {
                        const text = getTextContent(children);
                        const id = slugify(text);
                        return (
                            <h2
                                className="text-[21px] md:text-[24px] lg:text-[26px] font-sans font-bold tracking-[-0.015em] leading-[1.25] mb-4 md:mb-5 mt-10 md:mt-14 first:mt-0 text-zinc-900 dark:text-zinc-50"
                                id={id}
                                {...props}
                            >
                                {children}
                            </h2>
                        );
                    },
                    h3: ({ node, children, ...props }) => {
                        const text = getTextContent(children);
                        const id = slugify(text);
                        return (
                            <h3
                                className="text-[18px] md:text-[20px] lg:text-[22px] font-sans font-semibold tracking-[-0.01em] leading-[1.3] mb-3 md:mb-4 mt-8 md:mt-11 text-zinc-900 dark:text-zinc-50"
                                id={id}
                                {...props}
                            >
                                {children}
                            </h3>
                        );
                    },
                    h4: ({ node, children, ...props }) => {
                        const text = getTextContent(children);
                        const id = slugify(text);
                        return (
                            <h4
                                className="text-[16px] md:text-[17px] font-sans font-semibold leading-[1.4] mb-2 md:mb-3 mt-6 md:mt-9 text-zinc-900 dark:text-zinc-50"
                                id={id}
                                {...props}
                            >
                                {children}
                            </h4>
                        );
                    },
                    hr: ({ node, ...props }) => (
                        <hr
                            className="my-9 md:my-12 border-none text-center before:content-['⁕⁕⁕'] before:text-zinc-300 dark:before:text-zinc-600 before:tracking-[0.4em] before:text-[13px]"
                            {...props}
                        />
                    ),
                    img: ({ alt, height, src, width, ...props }) => {
                        const altText = (alt as string) || '';
                        return (
                            <span className="block my-7 md:my-10 -mx-4 md:mx-0">
                                <span className="block md:rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
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
                                    <span className="block text-center text-[13px] md:text-[14px] text-zinc-500 mt-3 md:mt-4 px-4 md:px-0 font-sans leading-relaxed">
                                        {altText}
                                    </span>
                                )}
                            </span>
                        );
                    },
                    li: ({ node, ...props }) => <li className="pl-0.5" {...props} />,
                    ol: ({ node, ...props }) => (
                        <ol
                            className="list-decimal mb-5 md:mb-6 pl-6 md:pl-7 space-y-1 md:space-y-2"
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => <p className="mb-5 md:mb-6 last:mb-0" {...props} />,
                    strong: ({ node, ...props }) => (
                        <strong
                            className="font-semibold text-zinc-800 dark:text-zinc-100"
                            {...props}
                        />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul
                            className="list-disc mb-5 md:mb-6 pl-6 md:pl-7 space-y-1 md:space-y-2 marker:text-zinc-400 dark:marker:text-zinc-500"
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
