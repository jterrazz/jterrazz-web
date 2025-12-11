import React from 'react';

import { Github, Twitter } from 'lucide-react';
import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';

// Domain
import { type Article } from '../../../../domain/article';
import { UserContactType } from '../../../../domain/user';
import { buildArticleSlug } from '../../../../domain/utils/slugify';

// Infrastructure
import { userRepository } from '../../../../infrastructure/repositories/user.repository';

// Utils
import { cn } from '../../../utils';

import { BannerAi } from '../../molecules/banner-ai/banner-ai';
import { CardArticle } from '../../molecules/card-article/card-article';
import { DividerSection } from '../../molecules/divider-section/divider-section';

type ArticleFooterProps = {
    className?: string;
    currentArticleId?: string;
    dateModified: string;
    datePublished: string;
    relatedArticles: Article[];
    seriesTitle?: string;
};

export const ArticleFooter: React.FC<ArticleFooterProps> = ({
    className,
    currentArticleId,
    dateModified,
    datePublished,
    relatedArticles,
    seriesTitle,
}) => {
    const profile = userRepository.getProfile();
    const github = userRepository.getContact(UserContactType.GitHub);
    const twitter = userRepository.getContact(UserContactType.X);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <footer className={cn('flex flex-col', className)}>
            {/* Series Articles */}
            {seriesTitle && relatedArticles.length > 0 && (
                <div className="flex flex-col gap-2 mb-10 md:mb-12">
                    <DividerSection title={`${seriesTitle} Series`} />
                    <div className="flex flex-col">
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
                                    <CardArticle
                                        category={article.metadata.category}
                                        datePublished={article.metadata.datePublished}
                                        description={article.metadata.description.en}
                                        imageUrl={article.imageUrl}
                                        position={index}
                                        slug={slug}
                                        title={article.metadata.title.en}
                                        total={relatedArticles.length}
                                        variant="compact"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 mb-6 md:mb-8" />

            {/* Author */}
            <div className="flex items-center gap-3 mb-4 md:mb-5">
                <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                        alt={profile.name}
                        className="object-cover"
                        fill
                        src="/assets/icons/appicon.jterrazz.png"
                    />
                </div>
                <span className="text-[14px] text-zinc-600 dark:text-zinc-400">
                    Written by{' '}
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                        {profile.name}
                    </span>
                </span>
                <div className="flex items-center gap-2 ml-auto">
                    <Link
                        aria-label="GitHub"
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        href={github.url.toString()}
                        target="_blank"
                    >
                        <Github size={16} />
                    </Link>
                    <Link
                        aria-label="X (Twitter)"
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        href={twitter.url.toString()}
                        target="_blank"
                    >
                        <Twitter size={16} />
                    </Link>
                </div>
            </div>

            {/* Metadata & AI Disclaimer */}
            <div className="text-[13px] md:text-[14px] text-zinc-400 dark:text-zinc-500 space-y-1">
                <p>
                    Published {formatDate(datePublished)}
                    {dateModified !== datePublished && ` · Updated ${formatDate(dateModified)}`}
                </p>
                <BannerAi />
            </div>

            {/* Related Articles (non-series) */}
            {!seriesTitle && relatedArticles.length > 0 && (
                <div className="flex flex-col gap-4 mt-12 md:mt-14">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[16px] md:text-[18px] font-semibold text-zinc-900 dark:text-zinc-100">
                            More articles
                        </h2>
                        <Link
                            className="text-[13px] md:text-[14px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            href="/articles"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="flex flex-col border-t border-zinc-200 dark:border-zinc-800">
                        {relatedArticles.map((article, index) => {
                            const slug = buildArticleSlug(
                                article.publicIndex,
                                article.metadata.title.en,
                            );

                            return (
                                <CardArticle
                                    category={article.metadata.category}
                                    datePublished={article.metadata.datePublished}
                                    description={article.metadata.description.en}
                                    imageUrl={article.imageUrl}
                                    key={article.metadata.title.en}
                                    position={index}
                                    slug={slug}
                                    title={article.metadata.title.en}
                                    total={relatedArticles.length}
                                    variant="horizontal"
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </footer>
    );
};
