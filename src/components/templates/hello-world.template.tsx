'use client';

import React from 'react';

import { ArrowRight, Blocks, BrainCircuit, Globe, Workflow } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type Experiment } from '../../domain/experiment';
import { type UserExperience } from '../../domain/user';

import { cn } from '../../lib/utils';

import { ArticlePreviewCard } from '../molecules/cards/article-preview-card';
import { FeaturedExperimentCard } from '../molecules/cards/featured-experiment-card';
import { SectionDivider } from '../molecules/section-divider';
import { Highlight } from '../molecules/typography/highlight';
import { Timeline } from '../organisms/timeline-of-experiences/timeline';
import { TimelineExperience } from '../organisms/timeline-of-experiences/timeline-experience';

interface Article {
    description: string;
    imageUrl: string;
    slug: string;
    title: string;
}

type HelloWorldTemplateProps = {
    description: string;
    experiences: UserExperience[];
    latestExperiments: Experiment[];
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
    <div
        className={cn(
            'group flex flex-col h-full p-6 sm:p-8 rounded-xl transition-all duration-300',
            'bg-white dark:bg-zinc-950',
            'border border-zinc-200 dark:border-zinc-800',
            'hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-black/40 hover:-translate-y-1',
            'hover:border-zinc-300 dark:hover:border-zinc-700',
            'relative overflow-hidden',
        )}
    >
        {/* Subtle gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-transparent to-transparent dark:from-zinc-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex flex-col h-full z-10">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Icon className="text-zinc-900 dark:text-zinc-100" size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {title}
                </h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 font-normal">
                {description}
            </p>
        </div>
    </div>
);

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    description,
    experiences,
    latestExperiments,
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
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <Highlight button={button} description={description} title="Hello, World!" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-24">
                {/* Latest Experiments Section */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <SectionDivider className="flex-1" title="Latest Experiments" />
                        <Link
                            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-8 whitespace-nowrap"
                            href="/experiments"
                        >
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {latestExperiments.map((experiment) => (
                            <FeaturedExperimentCard
                                experiment={experiment}
                                key={experiment.name}
                            />
                        ))}
                    </div>
                </section>

                {/* Latest Articles Section */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <SectionDivider className="flex-1" title="Latest Articles" />
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

                {/* Focus Areas */}
                <section>
                    <SectionDivider className="mb-12" title="Focus" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <FocusItem
                            description="Multiplying deep engineering expertise with AI to build ambitious, boundary-pushing projects."
                            icon={BrainCircuit}
                            title="AI Engineering"
                        />
                        <FocusItem
                            description="Building autonomous workflows that can plan, execute, and improve themselves."
                            icon={Workflow}
                            title="AI Agents"
                        />
                        <FocusItem
                            description="Crafting scalable, maintainable software using Domain-Driven Design."
                            icon={Blocks}
                            title="Architecture"
                        />
                        <FocusItem
                            description="Advocating for self-sovereignty and privacy through decentralized technologies."
                            icon={Globe}
                            title="Decentralization"
                        />
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
