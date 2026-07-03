import Image from 'next/image';
import React from 'react';

import { type Locale } from '../../../../i18n/config';
import { userRepository } from '../../../../infrastructure/repositories/user.repository';
import { cn } from '../../../utils';
import { formatDate } from '../../../utils/format-date';

type ArticleBylineProps = {
    className?: string;
    datePublished: string;
    locale: Locale;
    readingTimeMinutes: number;
};

const READING_LABEL: Record<Locale, (minutes: number) => string> = {
    en: (minutes) => `${minutes} min read`,
    fr: (minutes) => `${minutes} min de lecture`,
};

const WRITTEN_BY: Record<Locale, string> = {
    en: 'Written by',
    fr: 'Écrit par',
};

export const ArticleByline: React.FC<ArticleBylineProps> = ({
    className,
    datePublished,
    locale,
    readingTimeMinutes,
}) => {
    const profile = userRepository.getProfile();

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Image
                    alt={profile.name}
                    className="object-cover"
                    fill
                    sizes="40px"
                    src={profile.pictureUrl}
                />
            </div>
            <div className="flex min-w-0 flex-col">
                <span className="font-mono text-2xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {WRITTEN_BY[locale]}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {profile.name}
                </span>
                <span className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    <time dateTime={datePublished}>{formatDate(datePublished, locale)}</time>
                    {' · '}
                    {READING_LABEL[locale](readingTimeMinutes)}
                </span>
            </div>
        </div>
    );
};
