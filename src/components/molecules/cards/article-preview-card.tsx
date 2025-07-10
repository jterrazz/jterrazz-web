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
    // For 6 cards (0,1,2,3,4,5), centers are at positions 2 and 3
    const centerLeft = Math.floor((total - 1) / 2);
    const centerRight = Math.ceil((total - 1) / 2);

    // Calculate distance from nearest center
    const distanceFromCenter = Math.min(
        Math.abs(position - centerLeft),
        Math.abs(position - centerRight),
    );

    // Calculate opacity and blur based on distance from center
    const opacity = 1 - distanceFromCenter * 0.2; // 1 -> 0.8 -> 0.6
    const blur = distanceFromCenter * 2; // 0px -> 1px -> 2px

    return (
        <Link href={`/articles/${slug}`}>
            <motion.div
                className="group relative w-72 bg-white/5 border border-white/5 backdrop-blur-sm rounded-xl p-4 mx-2 transition-colors duration-300"
                initial={{
                    filter: `blur(${blur}px)`,
                    opacity,
                    y: 0,
                }}
                style={{
                    willChange: 'transform, filter, opacity',
                }}
                transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                }}
                whileHover={{
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: -5,
                }}
            >
                <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                    <img
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        src={imageUrl}
                    />
                </div>
                <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 line-clamp-2 ${
                        distanceFromCenter > 0 ? 'text-black' : 'text-white'
                    }`}
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2 line-clamp-1">{description}</p>
            </motion.div>
        </Link>
    );
};
