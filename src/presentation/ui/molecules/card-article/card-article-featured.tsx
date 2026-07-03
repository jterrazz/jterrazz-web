import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';
import { cn } from '../../../utils';
import { Heading, Lead } from '../../design-system';

export interface CardArticleFeaturedProps {
    className?: string;
    imageUrl: string;
    slug: string;
    tagline: string;
    title: string;
}

// Full-width spotlight for a featured article — editorial split with a large
// Cover image. Complements CardArticleRow, which handles regular list entries.
export const CardArticleFeatured: React.FC<CardArticleFeaturedProps> = ({
    className,
    imageUrl,
    slug,
    tagline,
    title,
}) => (
    <Link
        className={cn('group grid items-center gap-6 md:grid-cols-2 md:gap-12', className)}
        href={`/articles/${slug}`}
    >
        <div className="order-2 md:order-1">
            <Heading
                as="h3"
                className="mb-3 transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                size="heading"
            >
                {title}
            </Heading>
            <Lead size="md">{tagline}</Lead>
        </div>
        <div className="relative order-1 md:order-2 aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[0_0_6px_rgba(0,0,0,0.04)]">
            <Image
                alt={title}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                src={imageUrl}
            />
        </div>
    </Link>
);
