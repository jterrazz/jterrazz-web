import Image from "next/image";

import { Link } from "../../../../infrastructure/navigation/navigation";

import { cn } from "../../../utils";

export interface CardArticleRowProps {
  articleCount?: number;
  className?: string;
  imageUrl: string;
  slug: string;
  tagline: string;
  title: string;
}

/**
 * Clean horizontal article row with thumbnail on the right
 * @description Used for article lists in articles page and "More articles" section
 */
export const CardArticleRow: React.FC<CardArticleRowProps> = ({
  articleCount,
  className,
  imageUrl,
  slug,
  tagline,
  title,
}) => {
  const isSeries = articleCount !== undefined && articleCount > 1;

  return (
    <Link
      className={cn("group flex items-center gap-4 py-3", className)}
      href={`/articles/${slug}`}
    >
      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4 line-clamp-1">
            {title}
          </h3>
          {isSeries && (
            <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">· Series</span>
          )}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{tagline}</p>
      </div>
      {/* Thumbnail */}
      <div className="relative w-24 aspect-[16/10] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-lg">
        <Image alt={title} className="object-cover" fill sizes="96px" src={imageUrl} />
      </div>
    </Link>
  );
};
