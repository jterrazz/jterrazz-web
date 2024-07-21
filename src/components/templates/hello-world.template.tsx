'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

import { UserExperience, UserValue } from '../../domain/user.js';

import { mergeClassName } from '../../lib/utils.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { ValueCard } from '../molecules/cards/value-card.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { HorizontalContainer } from '../organisms/horizontal-container.js';
import { MainContainer } from '../organisms/main-container.jsx';
import { Timeline } from '../organisms/timeline-of-experiences/timeline.js';
import { TimelineExperience } from '../organisms/timeline-of-experiences/timeline-experience.js';

type HelloWorldTemplateProps = {
    experiences: UserExperience[];
    values: UserValue[];
    description: string;
};

export default function ParallaxImage({ className }: { className?: string }) {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [-10, -63]);
    const generatedClassName = mergeClassName(
        'flex justify-center items-center rounded-3xl overflow-hidden bg-black mb-12',
        className,
    );

    return (
        <div className={generatedClassName} style={{ height: '390px' }}>
            <motion.div
                style={{
                    height: '115%',
                    width: '100%',
                    y,
                }}
                className="relative"
            >
                <Image
                    src="/assets/computer.jpg"
                    alt="Florence landscape"
                    layout="fill"
                    objectFit="cover"
                />
            </motion.div>
        </div>
    );
}

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    experiences,
    values,
    description,
}) => {
    const { scrollYProgress } = useScroll();

    // Create a transform based on scroll position
    const y = useTransform(scrollYProgress, [0, 1], [0, -65]);

    const FloatingContainer = ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => {
        const generatedClassName = mergeClassName(
            'border border-black-and-white bg-white/90 backdrop-blur-sm p-12 py-6 rounded-3xl z-2',
            className,
        );
        return (
            <motion.div style={{ y }} className={generatedClassName}>
                {children}
            </motion.div>
        );
    };

    // Map the scroll position to a rotation value
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]); // Adjust scale range as needed

    return (
        <MainContainer>
            <Highlight title="Hello, World!" description={description} />
            <button>Check my apps</button>
            <FloatingContainer className="mt-6 mb-20 w-6/12 justify-self-center self-center z-10">
                <HorizontalContainer>
                    {values.map((value) => (
                        <ValueCard value={value} />
                    ))}
                </HorizontalContainer>
            </FloatingContainer>
            <ParallaxImage className="z-1 rounded-3xl mb-20 -mt-72" />
            <div className="flex flex-col items-center mb-6">
                <motion.div style={{ rotate, scale }}>
                    <Image
                        src="/assets/clock.png"
                        alt=""
                        width="42"
                        height="42"
                        className="object-center"
                    />
                </motion.div>

                <HeadingSection className="mt-3">
                    <HighlightedText>Timeline</HighlightedText>
                </HeadingSection>
            </div>
            <Timeline>
                {experiences.map((experience) => (
                    <TimelineExperience key={experience.title} experience={experience} />
                ))}
            </Timeline>
        </MainContainer>
    );
};
