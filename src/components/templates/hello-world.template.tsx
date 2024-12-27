'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

import { UserExperience, UserValue } from '../../domain/user.js';

import { mergeClassName } from '../../lib/utils.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';
import { Timeline } from '../organisms/timeline-of-experiences/timeline.js';
import { TimelineExperience } from '../organisms/timeline-of-experiences/timeline-experience.js';

import { ArticlePreview } from './articles-list.template.jsx';
import { ArticlesListViewModel } from './articles-list.template.view-model.js';

type HelloWorldTemplateProps = {
    experiences: UserExperience[];
    values: UserValue[];
    description: string;
    articles: ArticlesListViewModel;
};

const ParallaxImage: React.FC<{ className?: string }> = ({ className }) => {
    const { scrollYProgress } = useScroll();
    const yPercentage = useTransform(scrollYProgress, [0, 1], [0, -15]);
    const generatedClassName = mergeClassName(
        'relative rounded-3xl overflow-hidden bg-black w-full',
        className,
    );

    return (
        <div className={generatedClassName} style={{ aspectRatio: '16 / 9' }}>
            <motion.div
                style={{
                    height: '115%',
                    width: '100%',
                    y: useTransform(yPercentage, (value) => `${value}%`),
                }}
                className="absolute inset-0"
            >
                <Image
                    src="/assets/image-computer-table.webp"
                    alt="Computer workspace"
                    layout="fill"
                    objectFit="cover"
                />
            </motion.div>
        </div>
    );
};

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    experiences,
    values,
    description,
    articles,
}) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -65]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
    // const button = {
    //     href: '/articles',
    //     text: 'Check my articles',
    // };

    const latestArticles = articles.articles.slice(0, 2);

    return (
        <MainContainer>
            <Highlight title="Hello, World!" description={description} />
            {/* <div className="relative mt-2 mb-12 md:mb-20">
                <ParallaxImage className="z-0" />
                <motion.div
                    className="absolute inset-0 z-10 flex items-center justify-center p-6"
                    style={{ y }}
                >
                    <div className="flex bg-white/5 border border-white/5 backdrop-blur-sm rounded-xl opacity-90">
                        {values.map((value, index) => (
                            <ValueCard key={index} value={value} />
                        ))}
                    </div>
                </motion.div>
            </div> */}

            <HeadingSection>
                <HighlightedText className="pr-2">Latest articles</HighlightedText>
            </HeadingSection>
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {latestArticles.map((article) => (
                    <ArticlePreview key={article.index} article={article} />
                ))}
            </div>

            <div className="flex flex-col items-center">
                <motion.div style={{ rotate, scale }}>
                    <Image
                        src="/assets/icon-clock.png"
                        alt="Clock icon"
                        width={42}
                        height={42}
                        className="object-center"
                    />
                </motion.div>
                <HeadingSection className="mt-3">Timeline</HeadingSection>
            </div>
            <Timeline className="mt-2 md:mt-12">
                {experiences.map((experience) => (
                    <TimelineExperience key={experience.title} experience={experience} />
                ))}
            </Timeline>
        </MainContainer>
    );
};
