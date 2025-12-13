import { Link } from '../../../../infrastructure/navigation/navigation';

import { cn } from '../../../utils';

export interface CardArticleCompactProps {
    className?: string;
    slug: string;
    title: string;
}

/**
 * Minimal article card showing only title with navigation arrow
 * @description Used for series article lists where space is limited
 */
export const CardArticleCompact: React.FC<CardArticleCompactProps> = ({
    className,
    slug,
    title,
}) => {
    return (
        <Link className={cn('block group', className)} href={`/articles/${slug}`}>
            <article className="flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                        {title}
                    </h3>
                </div>

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
};


