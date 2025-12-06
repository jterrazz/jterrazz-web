'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Utils
import { cn } from '../../../utils';

interface CardArticleProps {
    category?: string;
    className?: string;
    datePublished?: string;
    description: string;
    imageUrl: string;
    position: number;
    slug: string;
    title: string;
    total: number;
    variant?: 'compact' | 'horizontal' | 'vertical';
}

export const CardArticle = ({
    category,
    className,
    datePublished,
    description,
    imageUrl,
    slug,
    title,
    variant = 'vertical',
}: CardArticleProps) => {
    const isHorizontal = variant === 'horizontal';
    const isCompact = variant === 'compact';

    if (isCompact) {
        return (
            <Link className={cn('block group', className)} href={`/articles/${slug}`}>
                <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 items-start">
                    {/* Image Container */}
                    <div className="relative w-full sm:w-36 lg:w-40 aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <Image
                            alt={title}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            fill
                            sizes="(max-width: 640px) 100vw, 160px"
                            src={imageUrl}
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-xl" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0 flex-1 gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                            {category && <span>{category}</span>}
                            {category && datePublished && <span>•</span>}
                            {datePublished && (
                                <time dateTime={datePublished}>
                                    {new Date(datePublished).toLocaleDateString(undefined, {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </time>
                            )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {title}
                        </h3>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    </div>

                    {/* Arrow (Desktop only) */}
                    <div className="hidden sm:block mt-1 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 group-hover:translate-x-1 transition-all duration-300">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <title>Read article</title>
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </article>
            </Link>
        );
    }

    if (isHorizontal) {
        return (
            <Link className={cn('block group', className)} href={`/articles/${slug}`}>
                <article className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-6 border-b border-zinc-200/60 dark:border-zinc-800 last:border-0 items-start">
                    {/* Image Container */}
                    <div className="sm:col-span-4 md:col-span-3">
                        <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            <Image
                                alt={title}
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 25vw"
                                src={imageUrl}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="sm:col-span-8 md:col-span-9 flex flex-col h-full justify-center min-w-0">
                        {/* Metadata */}
                        {(category || datePublished) && (
                            <div className="flex items-center gap-2 mb-3 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                                {category && (
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        {category}
                                    </span>
                                )}
                                {category && datePublished && <span>•</span>}
                                {datePublished && (
                                    <time dateTime={datePublished}>
                                        {new Date(datePublished).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </time>
                                )}
                            </div>
                        )}

                        <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4 max-w-2xl">
                            {description}
                        </p>

                        {/* Read More Link */}
                        <div className="mt-auto flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
                            Read article
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <title>Arrow right</title>
                                <path
                                    d="M5 12h14M12 5l7 7-7 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link className={cn('block group h-full', className)} href={`/articles/${slug}`}>
            <motion.article className="flex flex-col h-full" initial={false} whileHover="hover">
                {/* Image Container */}
                <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-4">
                    <Image
                        alt={title}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        src={imageUrl}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-2xl" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Metadata */}
                    {(category || datePublished) && (
                        <div className="flex items-center gap-2 mb-3 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                            {category && (
                                <span className="text-zinc-900 dark:text-zinc-100">{category}</span>
                            )}
                            {category && datePublished && <span>•</span>}
                            {datePublished && (
                                <time dateTime={datePublished}>
                                    {new Date(datePublished).toLocaleDateString(undefined, {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </time>
                            )}
                        </div>
                    )}

                    <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                        {description}
                    </p>

                    {/* Read More Link */}
                    <div className="mt-auto flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
                        Read article
                        <svg
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <title>Arrow right</title>
                            <path
                                d="M5 12h14M12 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
};
