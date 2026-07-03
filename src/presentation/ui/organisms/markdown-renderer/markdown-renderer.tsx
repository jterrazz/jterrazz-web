'use client';

import Image from 'next/image';
import { Highlight, themes } from 'prism-react-renderer';
import React from 'react';
import Markdown, { type Components } from 'react-markdown';

// Domain
import { slugify } from '../../../../domain/utils/slugify';
import { useTheme } from '../../../hooks/use-theme';
// Utils
import { cn } from '../../../utils';

// Helper to extract text content from React children
const getTextContent = (children: React.ReactNode): string => {
    if (typeof children === 'string') {
        return children;
    }
    if (Array.isArray(children)) {
        return children.map(getTextContent).join('');
    }
    if (React.isValidElement(children) && (children.props as Record<string, unknown>)?.children) {
        return getTextContent(
            (children.props as Record<string, unknown>).children as React.ReactNode,
        );
    }
    return '';
};

type MarkdownRendererProps = {
    className?: string;
    content: string;
};

const normalizeLanguage = (language?: string) => {
    if (!language) {
        return 'typescript';
    }
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
        <div className="my-6 md:my-8 -mx-4 md:mx-0 md:rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60">
            <Highlight code={code} language={language} theme={codeTheme}>
                {({ getLineProps, getTokenProps, style, tokens }) => (
                    <pre
                        className="p-4 md:p-6 overflow-x-auto text-sm font-mono leading-6"
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
                                    // oxlint-disable-next-line no-array-index-key -- Code tokens don't have stable IDs
                                    key={i}
                                    {...lineProps}
                                    style={{ ...lineStyle, whiteSpace: 'pre' }}
                                >
                                    {line.map((token, tokenIndex) => (
                                        <span
                                            // oxlint-disable-next-line no-array-index-key -- Code tokens don't have stable IDs
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

// Static component map — defined at module scope so react-markdown elements
// Keep a stable identity across renders (react/no-unstable-nested-components).
const markdownComponents: Components = {
    a: ({ ...props }) => (
        <a
            className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-zinc-600 dark:hover:decoration-zinc-300 underline-offset-[3px] transition-colors duration-150"
            {...props}
        />
    ),
    blockquote: ({ ...props }) => (
        <blockquote
            className="my-6 md:my-8 border-l-2 border-zinc-900 dark:border-zinc-100 pl-5 md:pl-8 text-xl md:text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100"
            {...props}
        />
    ),
    code: ({ className: codeClassName, children, ...props }) => {
        const match = /language-(?<lang>\w+)/.exec(codeClassName || '');
        const isInline = !match;

        if (isInline) {
            return (
                <code
                    className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[0.875em] font-mono text-zinc-800 dark:text-zinc-200"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        const language = normalizeLanguage(match?.[1]);
        return <CodeBlock language={language}>{String(children).replace(/\n$/, '')}</CodeBlock>;
    },
    em: ({ ...props }) => <em className="italic" {...props} />,
    h1: ({ children, ...props }) => {
        const id = slugify(getTextContent(children));
        return (
            <h2
                className="text-2xl md:text-3xl font-display font-semibold tracking-tight mb-3 md:mb-4 mt-12 md:mt-14 first:mt-0 text-zinc-900 dark:text-zinc-100"
                id={id}
                {...props}
            >
                {children}
            </h2>
        );
    },
    h2: ({ children, ...props }) => {
        const id = slugify(getTextContent(children));
        return (
            <h3
                className="text-xl md:text-2xl font-display font-semibold tracking-tight mb-3 mt-10 md:mt-12 first:mt-0 text-zinc-900 dark:text-zinc-100"
                id={id}
                {...props}
            >
                {children}
            </h3>
        );
    },
    h3: ({ children, ...props }) => {
        const id = slugify(getTextContent(children));
        return (
            <h4
                className="text-lg font-display font-semibold tracking-tight mb-2 mt-8 md:mt-10 text-zinc-900 dark:text-zinc-100"
                id={id}
                {...props}
            >
                {children}
            </h4>
        );
    },
    h4: ({ children, ...props }) => {
        const id = slugify(getTextContent(children));
        return (
            <h5
                className="text-base font-display font-semibold tracking-tight mb-2 mt-6 md:mt-8 text-zinc-900 dark:text-zinc-100"
                id={id}
                {...props}
            >
                {children}
            </h5>
        );
    },
    hr: ({ ...props }) => (
        <hr
            className="my-10 md:my-12 border-none text-center before:content-['⁕⁕⁕'] before:text-zinc-300 dark:before:text-zinc-600 before:tracking-[0.4em] before:text-xs"
            {...props}
        />
    ),
    img: ({ alt, height, src, width, ...props }) => {
        const altText = (alt as string) || '';
        return (
            <span className="block my-6 md:my-8 -mx-4 md:mx-0">
                <span className="block overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image
                        alt={altText}
                        className="w-full h-auto"
                        height={typeof height === 'number' ? height : 0}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 760px"
                        src={src as string}
                        style={{ height: 'auto', width: '100%' }}
                        width={typeof width === 'number' ? width : 0}
                        {...props}
                    />
                </span>
                {altText && (
                    <span className="block text-center text-sm text-zinc-500 mt-3 md:mt-4 px-4 md:px-0 font-sans">
                        {altText}
                    </span>
                )}
            </span>
        );
    },
    li: ({ ...props }) => <li className="pl-0.5" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal mb-4 pl-6 space-y-1.5" {...props} />,
    p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
    strong: ({ ...props }) => (
        <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
    ),
    ul: ({ ...props }) => (
        <ul
            className="list-disc mb-4 pl-6 space-y-1.5 marker:text-zinc-400 dark:marker:text-zinc-500"
            {...props}
        />
    ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ className, content }) => {
    // Editorial sans-serif body: generous measure and leading for long-form reading.
    const baseClassName =
        'font-sans text-base md:text-lg text-zinc-800 dark:text-zinc-300 antialiased';
    const generatedClassName = cn(baseClassName, className);

    return (
        <article className={generatedClassName}>
            <Markdown components={markdownComponents}>{content}</Markdown>
        </article>
    );
};
