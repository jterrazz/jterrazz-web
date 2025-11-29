'use client';

import React from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock } from 'lucide-react';
import Image from 'next/image';

// Domain
import { type UserExperience } from '../../domain/user.js';

// Utils
import { cn } from '../../lib/utils.js';

import { ArticlePreviewCard } from '../molecules/cards/article-preview-card.jsx';
import { SectionDivider } from '../molecules/section-divider.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';
import { TimelineExperience } from '../organisms/timeline-of-experiences/timeline-experience.js';
import { Timeline } from '../organisms/timeline-of-experiences/timeline.js';

interface Article {
    description: string;
    imageUrl: string;
    slug: string;
    title: string;
}

type HelloWorldTemplateProps = {
    description: string;
    experiences: UserExperience[];
    topArticles: Article[];
};

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    description,
    experiences,
    topArticles,
}) => {
    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const button = {
        href: '/articles',
        text: 'Read Articles',
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <Highlight
                        button={button}
                        description={description}
                        title="Hello, World!"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-24 md:space-y-32">
                
                {/* Latest Articles Section */}
                <section>
                    <SectionDivider className="mb-12" title="Latest Writing" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topArticles.slice(0, 6).map((article, index, arr) => (
                            <ArticlePreviewCard
                                key={article.title}
                                {...article}
                                position={index}
                                total={arr.length}
                            />
                        ))}
                    </div>
                </section>

                {/* Timeline Section */}
                <section>
                    <SectionDivider className="mb-16" title="Journey" />

                    <div className="max-w-3xl mx-auto w-full">
                        <Timeline>
                            {experiences.map((experience, index) => (
                                <TimelineExperience
                                    experience={experience}
                                    index={index}
                                    key={experience.title}
                                />
                            ))}
                        </Timeline>
                    </div>
                </section>
            </div>
        </div>
    );
};
