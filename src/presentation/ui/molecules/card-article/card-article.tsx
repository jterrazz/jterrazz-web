"use client";

import { motion } from "framer-motion";
import { IconBookFilled } from "@tabler/icons-react";
import Image from "next/image";

import { Link } from "../../../../infrastructure/navigation/navigation";

import { cn } from "../../../utils";

export interface CardArticleProps {
  articleCount?: number;
  className?: string;
  description: string;
  imageUrl: string;
  seriesName?: string;
  slug: string;
  title: string;
}

/**
 * Featured article card with image, title, description, and optional series badge
 * @description Used for featured articles on home page
 */
export const CardArticle: React.FC<CardArticleProps> = ({
  articleCount,
  className,
  description,
  imageUrl,
  seriesName,
  slug,
  title,
}) => {
  const isSeries = !!seriesName;

  return (
    <Link className={cn("block group h-full", className)} href={`/articles/${slug}`}>
      <motion.article className="flex flex-col h-full" initial={false} whileHover="hover">
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-4">
          <Image
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
            src={imageUrl}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-2xl" />

          {isSeries && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-sm">
              <IconBookFilled size={12} />
              <span>{articleCount} parts</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {title}
          </h3>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
            {description}
          </p>

          <div className="mt-auto flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
            {isSeries ? "Start series" : "Read article"}
            <svg
              aria-hidden="true"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <title>Arrow right</title>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
