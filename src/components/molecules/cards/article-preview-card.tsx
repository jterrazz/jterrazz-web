'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
                className="flex flex-col h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {/* Image Container */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-5 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <Image
                        alt={title}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        src={imageUrl}
                    />
                    
                    {/* Overlay Icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </motion.article>
        </Link>
    );
};
