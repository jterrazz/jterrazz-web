'use client';

import React from 'react';

import Link from 'next/link';

// Utils
import { cn } from '../../../utils';

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
        <div
            className={cn(
                'flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400',
                className,
            )}
        >
            <span>Also in</span>
            {availableLanguages
                .filter((lang) => lang !== currentLanguage)
                .map((lang) => (
                    <Link
                        className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
                        href={`/articles/${articleId}/${lang}`}
                        hrefLang={lang}
                        key={lang}
                        rel="alternate"
                    >
                        {lang === 'en'
                            ? 'English'
                            : lang === 'fr'
                              ? 'Français'
                              : lang.toUpperCase()}
                    </Link>
                ))}
        </div>
    );
};
