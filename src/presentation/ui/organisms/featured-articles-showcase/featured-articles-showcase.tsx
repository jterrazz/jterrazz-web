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

// The cover/satellite split is a pointer idiom: it advances on a timer and
// Retargets on hover. Neither exists on a phone, where an advancing cover just
// Moves the tap target out from under the thumb. Below this breakpoint the
// Showcase freezes on the first article and the satellites become a plain list
// (see the `md:` gates in the markup). Kept in sync with Tailwind's `md`.
const POINTER_LAYOUT = '(min-width: 768px)';

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
    // Server-renders as the mobile layout, so the cover is always article 0 on
    // The first paint and never flashes a different one during hydration.
    const [isPointerLayout, setIsPointerLayout] = useState(false);

    useEffect(() => {
        const query = window.matchMedia(POINTER_LAYOUT);
        const sync = () => {
            setIsPointerLayout(query.matches);
            if (!query.matches) {
                setActive(0);
            }
        };
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (isPaused || !isPointerLayout || articles.length < 2) {
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
    }, [isPaused, isPointerLayout, articles.length]);

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
                {/* The overlay is clipped by the cover's aspect box, so both
                    lines are clamped — a long title on a narrow screen used to
                    have its first line cropped off the top. */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-10">
                    <Heading
                        as="h3"
                        className="mb-1 line-clamp-2 !text-xl !text-white sm:!text-2xl md:!text-3xl"
                        size="heading"
                    >
                        {activeArticle.title}
                    </Heading>
                    <Lead className="line-clamp-1 !text-zinc-200" size="md">
                        {activeArticle.tagline}
                    </Lead>
                </div>
            </Link>

            <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-4 md:gap-8">
                {articles.map((article, index) => {
                    const isSeries = article.articleCount !== undefined && article.articleCount > 1;
                    const isActive = index === active;
                    return (
                        <Link
                            // On mobile `active` is pinned to 0, so the first
                            // Satellite would just repeat the cover above it.
                            className={cn('group', index === 0 && 'hidden md:block')}
                            href={`/articles/${article.slug}`}
                            key={article.slug}
                            onMouseEnter={() => setActive(index)}
                        >
                            <div
                                aria-hidden
                                className={cn(
                                    'mb-3 h-px w-full transition-colors duration-300',
                                    isActive
                                        ? 'bg-zinc-200 dark:bg-zinc-800 md:bg-zinc-900 md:dark:bg-zinc-100'
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
                                            : // Dimming marks "not on the cover", which only
                                              // Means something where hovering can change it.
                                              'text-zinc-950 dark:text-white md:text-zinc-500 md:dark:text-zinc-400 md:group-hover:text-zinc-950 md:dark:group-hover:text-white',
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
