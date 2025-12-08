'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Utils
import { cn } from '../../../utils';

interface CardArticleProps {
    articleCount?: number;
    category?: string;
    className?: string;
    datePublished?: string;
    description: string;
    imageUrl: string;
    position: number;
    seriesName?: string;
    slug: string;
    title: string;
    total: number;
    variant?: 'compact' | 'horizontal' | 'vertical';
}

export const CardArticle = ({
    articleCount,
    category,
    className,
    datePublished,
    description,
    imageUrl,
    seriesName,
    slug,
    title,
    variant = 'vertical',
}: CardArticleProps) => {
    const isHorizontal = variant === 'horizontal';
    const isCompact = variant === 'compact';
    const isSeries = !!seriesName;

    if (isCompact) {
        return (
            <Link className={cn('block group', className)} href={`/articles/${slug}`}>
                <article className="flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                            {title}
                        </h3>
                    </div>

                    {/* Arrow */}
                    <div className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0">
                        <svg
                            className="w-4 h-4"
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
                                        {new Date(datePublished).toLocaleDateString('en-US', {
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

                    {/* Series Badge */}
                    {isSeries && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-sm">
                            <BookOpen size={12} />
                            <span>{articleCount} parts</span>
                        </div>
                    )}
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
                                    {new Date(datePublished).toLocaleDateString('en-US', {
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

                    {/* CTA Link */}
                    <div className="mt-auto flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
                        {isSeries ? 'Start series' : 'Read article'}
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
