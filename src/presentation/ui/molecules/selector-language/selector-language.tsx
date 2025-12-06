'use client';

import React from 'react';

import Link from 'next/link';

// Utils
import { cn } from '../../../utils';

import { SelectionIndicator } from '../../atoms/selection-indicator/selection-indicator';

type SelectorLanguageProps = {
    articleId: string;
    availableLanguages: string[];
    className?: string;
    currentLanguage: string;
};

export const SelectorLanguage: React.FC<SelectorLanguageProps> = ({
    articleId,
    availableLanguages,
    className,
    currentLanguage,
}) => {
    if (availableLanguages.length <= 1) return null;

    return (
        <div className={cn('flex justify-center', className)}>
            <div className="p-1 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50">
                <SelectionIndicator
                    className="rounded-full bg-white dark:bg-zinc-950 shadow-sm"
                    defaultValue={currentLanguage}
                    transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.3,
                    }}
                >
                    {availableLanguages.map((lang) => (
                        <div data-id={lang} key={lang}>
                            <Link
                                aria-current={currentLanguage === lang ? 'page' : undefined}
                                className={cn(
                                    'relative block px-4 py-1.5 text-xs font-semibold tracking-wider transition-colors duration-200',
                                    currentLanguage === lang
                                        ? 'text-zinc-900 dark:text-zinc-100'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200',
                                )}
                                href={`/articles/${articleId}/${lang}`}
                                hrefLang={lang}
                                rel={currentLanguage === lang ? 'canonical' : 'alternate'}
                            >
                                {lang.toUpperCase()}
                            </Link>
                        </div>
                    ))}
                </SelectionIndicator>
            </div>
        </div>
    );
};
