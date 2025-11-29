import React from 'react';

import { Calendar, Clock, Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Domain
import { type Article } from '../../domain/article';
import { UserContactType } from '../../domain/user';

// Infrastructure
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository';

// Utils
import { cn } from '../../lib/utils';

import { buildArticleSlug } from '../../lib/slugify';
import { Badge, BadgeColor } from '../atoms/status/badge';
import { AIBanner } from '../molecules/ai-banner';
import { ArticlePreviewCard } from '../molecules/cards/article-preview-card';
import { SectionDivider } from '../molecules/section-divider';

type ArticleFooterProps = {
    category: string;
    className?: string;
    currentArticleId?: string;
    dateModified: string;
    datePublished: string;
    relatedArticles: Article[];
    seriesTitle?: string;
};

export const ArticleFooter: React.FC<ArticleFooterProps> = ({
    category,
    className,
    currentArticleId,
    dateModified,
    datePublished,
    relatedArticles,
    seriesTitle,
}) => {
    const userRepository = new UserInMemoryRepository();
    const profile = userRepository.getProfile();
    const github = userRepository.getContact(UserContactType.GitHub);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const twitter = userRepository.getContact(UserContactType.X);

    return (
        <footer className={cn('flex flex-col gap-16 md:gap-24', className)}>
            <div className="flex flex-col gap-8">
                {/* AI Disclaimer */}
                <AIBanner />

                {/* Unified Author & Context Card */}
                <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 p-8 md:p-10">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-zinc-100 dark:bg-zinc-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 flex flex-col gap-8">
                        {/* Article Metadata */}
                        <div className="flex flex-wrap gap-6 text-sm text-zinc-500 dark:text-zinc-400 pb-8 border-b border-zinc-200 dark:border-zinc-800/50">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                <span>
                                    Published on {new Date(datePublished).toLocaleDateString()}
                                </span>
                            </div>
                            {dateModified !== datePublished && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span>
                                        Updated on {new Date(dateModified).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Badge color={BadgeColor.Gray} filled={false} value={category} />
                            </div>
                        </div>

                        {/* Author Identity */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-sm">
                                <Image
                                    alt={profile.name}
                                    className="object-cover"
                                    fill
                                    src="/assets/icons/app-icon.jterrazz.png"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                            {profile.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                            {profile.headline}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            aria-label="GitHub"
                                            className="p-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all hover:-translate-y-0.5"
                                            href={github.url.toString()}
                                            target="_blank"
                                        >
                                            <Github size={16} />
                                        </Link>
                                        <Link
                                            aria-label="LinkedIn"
                                            className="p-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all hover:-translate-y-0.5"
                                            href={linkedin.url.toString()}
                                            target="_blank"
                                        >
                                            <Linkedin size={16} />
                                        </Link>
                                        <Link
                                            aria-label="X (Twitter)"
                                            className="p-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all hover:-translate-y-0.5"
                                            href={twitter.url.toString()}
                                            target="_blank"
                                        >
                                            <Twitter size={16} />
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl">
                                    Focusing on clean architecture, AI agents, and building
                                    resilient systems. I write about what I learn as I build
                                    software.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Articles / Series */}
            {relatedArticles.length > 0 && (
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between px-2">
                        {seriesTitle ? (
                            <SectionDivider title={`${seriesTitle} Series`} />
                        ) : (
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                Read Next
                            </h2>
                        )}
                        {!seriesTitle && (
                            <Link
                                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                href="/articles"
                            >
                                View all articles →
                            </Link>
                        )}
                    </div>
                    <div className="flex flex-col border-t border-zinc-200/60 dark:border-zinc-800">
                        {relatedArticles.map((article, index) => {
                            const slug = buildArticleSlug(
                                article.publicIndex,
                                article.metadata.title.en,
                            );
                            const isCurrent = currentArticleId === slug;

                            return (
                                <div
                                    className={cn(
                                        isCurrent && 'opacity-50 pointer-events-none grayscale',
                                    )}
                                    key={article.metadata.title.en}
                                >
                                    <ArticlePreviewCard
                                        category={article.metadata.category}
                                        datePublished={article.metadata.datePublished}
                                        description={article.metadata.description.en}
                                        imageUrl={article.imageUrl}
                                        position={index}
                                        slug={slug}
                                        title={article.metadata.title.en}
                                        total={relatedArticles.length}
                                        variant={seriesTitle ? 'compact' : 'horizontal'}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </footer>
    );
};
