import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';

import { cn } from '../../../utils';

export interface CardArticleHorizontalProps {
    category: string;
    className?: string;
    datePublished: string;
    description: string;
    imageUrl: string;
    slug: string;
    title: string;
}

/**
 * Formats a date string to "Month Year" format
 */
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Horizontal article card with image on left, content on right
 * @description Used for "More articles" section in article footer
 */
export const CardArticleHorizontal: React.FC<CardArticleHorizontalProps> = ({
    category,
    className,
    datePublished,
    description,
    imageUrl,
    slug,
    title,
}) => {
    return (
        <Link className={cn('block group', className)} href={`/articles/${slug}`}>
            <article className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-6 border-b border-zinc-200/60 dark:border-zinc-800 last:border-0 items-start">
                {/* Image */}
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
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                        <span className="text-zinc-900 dark:text-zinc-100">{category}</span>
                        <span>•</span>
                        <time dateTime={datePublished}>{formatDate(datePublished)}</time>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4 max-w-2xl">
                        {description}
                    </p>

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
};


