import { IconFlaskFilled } from '@tabler/icons-react';
import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';
import { Heading, Lead, Tag } from '../../design-system';
import { cn } from '../../../utils';

export interface CardArticleRowProps {
    articleCount?: number;
    className?: string;
    experimentSlug?: string;
    imageUrl: string;
    slug: string;
    tagline: string;
    title: string;
}

export const CardArticleRow: React.FC<CardArticleRowProps> = ({
    articleCount,
    className,
    experimentSlug,
    imageUrl,
    slug,
    tagline,
    title,
}) => {
    const isSeries = articleCount !== undefined && articleCount > 1;
    const hasExperiment = Boolean(experimentSlug);

    return (
        <Link
            className={cn('group flex items-center gap-4 py-3', className)}
            href={`/articles/${slug}`}
        >
            <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <Heading
                        as="h3"
                        className="line-clamp-1 transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                        size="title"
                    >
                        {title}
                    </Heading>
                    {hasExperiment && (
                        <span className="relative shrink-0 group/tooltip">
                            <IconFlaskFilled
                                className="text-zinc-400 dark:text-zinc-500"
                                size={14}
                            />
                            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-zinc-900 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Linked to {experimentSlug} experiment
                            </span>
                        </span>
                    )}
                </div>
                <Lead className="line-clamp-1" size="sm">
                    {tagline}
                </Lead>
            </div>
            {isSeries && <Tag className="shrink-0">Series</Tag>}
            <div className="relative w-24 aspect-[16/10] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[0_0_6px_rgba(0,0,0,0.04)]">
                <Image
                    alt={title}
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    fill
                    sizes="96px"
                    src={imageUrl}
                />
            </div>
        </Link>
    );
};
