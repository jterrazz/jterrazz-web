'use client';

import React from 'react';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Utils
import { cn } from '../../../lib/utils.js';

interface ArticlePreviewProps {
    className?: string;
    description: string;
    imageUrl: string;
    position: number;
    slug: string;
    title: string;
    total: number;
}

export const ArticlePreviewCard = ({
    className,
    description,
    imageUrl,
    slug,
    title,
}: ArticlePreviewProps) => {
    return (
        <Link className={cn('block group h-full', className)} href={`/articles/${slug}`}>
            <motion.article
                className="flex flex-col h-full p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-200/10 dark:hover:shadow-zinc-900/20"
                transition={{ duration: 0.2, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
            >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-6 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                    <Image
                        alt={title}
                        className="object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        src={imageUrl}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                    <div className="mb-0">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight line-clamp-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                            {title}
                        </h3>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
};
