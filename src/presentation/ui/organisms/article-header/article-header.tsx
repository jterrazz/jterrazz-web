import { IconFlaskFilled } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';

import { type Locale } from '../../../../i18n/config';
import { Link } from '../../../../infrastructure/navigation/navigation';
import { cn } from '../../../utils';
import { Heading, Kicker, Lead } from '../../design-system';

type ArticleHeaderProps = {
    className?: string;
    description?: string;
    experiment?: null | { name: string; slug: string };
    imageUrl?: string;
    locale: Locale;
    nextHref?: null | string;
    prevHref?: null | string;
    seriesName?: string;
    seriesPosition?: number;
    seriesTotal?: number;
    title: string;
};

const PART_LABEL: Record<Locale, (position: number, total: number) => string> = {
    en: (position, total) => `Part ${position} of ${total}`,
    fr: (position, total) => `Partie ${position} sur ${total}`,
};

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
    className,
    description,
    experiment,
    imageUrl,
    locale,
    nextHref,
    prevHref,
    seriesName,
    seriesPosition,
    seriesTotal,
    title,
}) => {
    const eyebrowParts = [
        seriesName &&
            (seriesPosition && seriesTotal
                ? `${seriesName} · ${PART_LABEL[locale](seriesPosition, seriesTotal)}`
                : seriesName),
    ].filter(Boolean) as string[];

    const showNav = Boolean(seriesName) && Boolean(prevHref || nextHref);

    return (
        <header className={cn('flex flex-col', className)}>
            {(eyebrowParts.length > 0 || showNav) && (
                <div className="mb-5 flex items-center justify-between gap-4 md:mb-6">
                    {eyebrowParts.length > 0 ? (
                        <Kicker>{eyebrowParts.join(' · ')}</Kicker>
                    ) : (
                        <span />
                    )}
                    {showNav && (
                        <nav className="flex shrink-0 items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            {prevHref ? (
                                <Link
                                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                                    href={prevHref}
                                >
                                    ← Prev
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed text-zinc-300 dark:text-zinc-600">
                                    ← Prev
                                </span>
                            )}
                            {nextHref ? (
                                <Link
                                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                                    href={nextHref}
                                >
                                    Next →
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed text-zinc-300 dark:text-zinc-600">
                                    Next →
                                </span>
                            )}
                        </nav>
                    )}
                </div>
            )}

            <Heading className="mb-5 md:mb-6 max-w-4xl" size="display">
                {title}
            </Heading>

            {description && (
                <Lead className="max-w-3xl" size="lg">
                    {description}
                </Lead>
            )}

            {experiment && (
                <Link
                    className="group mt-5 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                    href={`/experiments/${experiment.slug}`}
                >
                    <IconFlaskFilled className="text-zinc-400 dark:text-zinc-500" size={14} />
                    <span>
                        Part of the{' '}
                        <span className="font-medium text-zinc-900 underline-offset-2 group-hover:underline dark:text-zinc-100">
                            {experiment.name}
                        </span>{' '}
                        experiment
                    </span>
                </Link>
            )}

            {/* Hero image — edge-to-edge on mobile, contained on desktop */}
            {imageUrl && (
                <div className="-mx-4 mt-12 md:mx-0 md:mt-20">
                    <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                            alt={title}
                            className="object-cover"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1152px"
                            src={imageUrl}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};
