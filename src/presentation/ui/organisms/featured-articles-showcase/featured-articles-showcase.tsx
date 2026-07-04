'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Link } from '../../../../infrastructure/navigation/navigation';
import { cn } from '../../../utils';
import { Heading, Lead, Tag } from '../../design-system';

export type ShowcaseArticle = {
    articleCount?: number;
    imageUrl: string;
    slug: string;
    tagline: string;
    title: string;
};

type FeaturedArticlesShowcaseProps = {
    articles: ShowcaseArticle[];
    className?: string;
};

const AUTO_ADVANCE_MS = 5000;

/**
 * Interactive cover showcase — a full-width cover with the title overlaid,
 * driven by the satellite columns below. Auto-advances through the articles
 * once the page is up; pauses while the pointer is over the section and for
 * users who prefer reduced motion. All covers stay mounted (opacity
 * crossfade) so swaps are instant.
 */
export const FeaturedArticlesShowcase: React.FC<FeaturedArticlesShowcaseProps> = ({
    articles,
    className,
}) => {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || articles.length < 2) {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const id = setInterval(
            () => setActive((current) => (current + 1) % articles.length),
            AUTO_ADVANCE_MS,
        );
        return () => clearInterval(id);
    }, [isPaused, articles.length]);

    const activeArticle = articles[active];

    return (
        <div
            className={className}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <Link
                className="group relative block aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:aspect-[21/9]"
                href={`/articles/${activeArticle.slug}`}
            >
                {articles.map((article, index) => (
                    <Image
                        alt={article.title}
                        className={cn(
                            'object-cover transition-opacity duration-500',
                            index === active ? 'opacity-100' : 'opacity-0',
                        )}
                        fill
                        key={article.slug}
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 1152px"
                        src={article.imageUrl}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                    <Heading as="h3" className="mb-1 !text-white" size="heading">
                        {activeArticle.title}
                    </Heading>
                    <Lead className="!text-zinc-200" size="md">
                        {activeArticle.tagline}
                    </Lead>
                </div>
            </Link>

            <div className="mt-8 grid gap-8 md:grid-cols-4">
                {articles.map((article, index) => {
                    const isSeries = article.articleCount !== undefined && article.articleCount > 1;
                    const isActive = index === active;
                    return (
                        <Link
                            className="group"
                            href={`/articles/${article.slug}`}
                            key={article.slug}
                            onMouseEnter={() => setActive(index)}
                        >
                            <div
                                aria-hidden
                                className={cn(
                                    'mb-3 h-px w-full transition-colors duration-300',
                                    isActive
                                        ? 'bg-zinc-900 dark:bg-zinc-100'
                                        : 'bg-zinc-200 dark:bg-zinc-800',
                                )}
                            />
                            <div className="flex items-center gap-2">
                                <Heading
                                    as="h3"
                                    className={cn(
                                        'transition-colors duration-300',
                                        isActive
                                            ? 'text-zinc-950 dark:text-white'
                                            : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white',
                                    )}
                                    size="title"
                                >
                                    {article.title}
                                </Heading>
                                {isSeries && <Tag className="shrink-0">Series</Tag>}
                            </div>
                            <Lead className="mt-0.5 line-clamp-1" size="sm">
                                {article.tagline}
                            </Lead>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
