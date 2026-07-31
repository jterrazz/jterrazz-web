import { IconFlaskFilled } from '@tabler/icons-react';
import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';
import { cn } from '../../../utils';
import { IconHint } from '../../atoms/icon-hint/icon-hint';
import { Heading, Lead, Tag } from '../../design-system';

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
            className={cn('group flex items-center gap-3 py-3 md:gap-4', className)}
            href={`/articles/${slug}`}
        >
            <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <Heading
                        as="h3"
                        // A one-line clamp costs a phone most of the title;
                        // Desktop rows are wide enough to stay single-line.
                        className="line-clamp-2 transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400 md:line-clamp-1"
                        size="title"
                    >
                        {title}
                    </Heading>
                    {hasExperiment && (
                        <IconHint
                            icon={<IconFlaskFilled size={14} />}
                            label={`Linked to ${experimentSlug} experiment`}
                        />
                    )}
                </div>
                <Lead className="line-clamp-2 md:line-clamp-1" size="sm">
                    {tagline}
                </Lead>
            </div>
            {isSeries && <Tag className="shrink-0">Series</Tag>}
            <div className="relative w-20 aspect-[16/10] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[0_0_6px_rgba(0,0,0,0.04)] md:w-24">
                <Image
                    alt={title}
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    src={imageUrl}
                />
            </div>
        </Link>
    );
};
