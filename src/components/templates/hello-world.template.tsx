'use client';

import React from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Blocks, BrainCircuit, Globe, Workflow } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type UserExperience } from '../../domain/user.js';

import { ArticlePreviewCard } from '../molecules/cards/article-preview-card.jsx';
import { SectionDivider } from '../molecules/section-divider.js';
import { Highlight } from '../molecules/typography/highlight.js';
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

const FocusItem = ({
    description,
    icon: Icon,
    title,
}: {
    description: string;
    icon: React.ElementType;
    title: string;
}) => (
    <div className="group relative h-full p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-200/10 dark:hover:shadow-zinc-900/20 hover:-translate-y-1">
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Icon size={24} className="text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    description,
    experiences,
    topArticles,
}) => {
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

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-32">
                
                {/* Focus Areas */}
                <section className="max-w-4xl mx-auto w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <FocusItem
                            description="Exploring every AI tool to become a better engineer."
                            icon={BrainCircuit}
                            title="AI Engineering"
                        />
                        <FocusItem
                            description="Orchestrating autonomous agents and intelligent workflows."
                            icon={Workflow}
                            title="AI Systems"
                        />
                        <FocusItem
                            description="Designing resilient systems."
                            icon={Blocks}
                            title="Clean Architecture"
                        />
                        <FocusItem
                            description="Empowering the individual."
                            icon={Globe}
                            title="Decentralization"
                        />
                    </div>
                </section>

                {/* Latest Articles Section */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <SectionDivider className="flex-1" title="Latest Writing" />
                        <Link 
                            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-8 whitespace-nowrap"
                            href="/articles"
                        >
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                    <SectionDivider className="mb-20" title="Journey" />

                    <div className="max-w-4xl mx-auto w-full">
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
