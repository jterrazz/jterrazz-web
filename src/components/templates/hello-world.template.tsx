'use client';

import React from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// Domain
import { type UserExperience } from '../../domain/user.js';

// Utils
import { cn } from '../../lib/utils.js';

import { HeadingSection } from '../atoms/typography/heading-section.js';
import { ArticlePreviewCard } from '../molecules/cards/article-preview-card.jsx';
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

const ParallaxImage: React.FC<{ className?: string }> = ({ className }) => {
    const { scrollYProgress } = useScroll();
    const yPercentage = useTransform(scrollYProgress, [0, 1], [0, -15]);
    const generatedClassName = cn(
        'relative rounded-2xl overflow-hidden bg-black w-full',
        className,
    );

    return <div className={generatedClassName} style={{ aspectRatio: '16 / 9' }}></div>;
};

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    description,
    experiences,
    topArticles,
}) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -65]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
    const button = {
        href: '/articles',
        text: 'Check my articles',
    };

    return (
        <MainContainer size="full">
            <Highlight button={button} description={description} title="Hello, World!" />
            {/* Article previews section */}

            <HeadingSection className="mb-12">Latest Articles</HeadingSection>
            <div className="relative w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {topArticles.slice(0, 6).map((article, index, arr) => (
                        <ArticlePreviewCard
                            key={article.title}
                            {...article}
                            position={index}
                            total={arr.length}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <motion.div style={{ rotate, scale }}>
                    <Image
                        alt="Clock icon"
                        className="object-center"
                        height={42}
                        src="/assets/icon-clock.png"
                        width={42}
                    />
                </motion.div>
                <HeadingSection className="mt-3">Timeline</HeadingSection>
            </div>
            <Timeline className="mt-2 md:mt-12">
                {experiences.map((experience, index) => (
                    <TimelineExperience
                        experience={experience}
                        index={index}
                        key={experience.title}
                    />
                ))}
            </Timeline>
        </MainContainer>
    );
};
