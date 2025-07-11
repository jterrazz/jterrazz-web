'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ArticlePreviewProps {
    description: string;
    imageUrl: string;
    position: number;
    slug: string;
    title: string;
    total: number;
}

export const ArticlePreviewCard = ({
    description,
    slug,
    imageUrl,
    position,
    title,
    total,
}: ArticlePreviewProps) => {
    // Grid layout shows all cards equally—no blur or opacity reduction.
    const opacity = 1;
    const blur = 0;

    return (
        <Link href={`/articles/${slug}`}>
            <motion.div
                className="group relative w-full bg-white/5 border border-white/5 backdrop-blur-sm rounded-xl transition-colors duration-300"
                initial={{ opacity, y: 0 }}
                style={{
                    willChange: 'transform, filter, opacity',
                }}
                transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                }}
                whileHover={{ opacity: 1, y: -5 }}
            >
                <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                    <img
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        src={imageUrl}
                    />
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-black">{title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 line-clamp-1">{description}</p>
            </motion.div>
        </Link>
    );
};
