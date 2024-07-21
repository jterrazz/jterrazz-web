import React from 'react';

import { Experience } from '../../domain/profile/experience.js';

import { HeadingSection } from '../atoms/typography/Heading.Section.jsx';
import { Value, ValueCard } from '../molecules/card/ValueCard.jsx';
import { Highlight } from '../molecules/typography/Highlight.js';
import { HorizontalCards } from '../organisms/HorizontalCards.jsx';
import { Timeline } from '../organisms/Timeline.jsx';

type WelcomeTimelineProps = {
    experiences: Experience[];
    values: Value[]; // TODO Move in domain
    className?: string;
};

// TODO Check all are in main
// TODO Use SVG images

export const HelloWorldTemplate: React.FC<WelcomeTimelineProps> = ({
    experiences,
    values,
    className = '',
}) => {
    const generatedClassName = `flex flex-col content-start items-start self-center ${className}`;

    return (
        <main
            className={generatedClassName}
            style={{
                maxWidth: 740,
            }}
        >
            <div className="flex items-center">
                <Highlight
                    className="mt-20 mb-8"
                    title="Hello, World!"
                    description="I make products and build things with startups and organizations. I'm also a finance
                guy by formation and passion and spend a lot of time thinking about the intersection
                of finance, technology, and society. I believe in making things that liberate people
                from power they can't control. That's why I will focus on two projects that empower
                people in the future (Self Improvement and Web3 + DeFi). I'm also love photography
                and writing my ideas. I write about finance, technology, and society."
                />
            </div>

            <HorizontalCards>
                {values.map((value, index) => (
                    <ValueCard value={value} />
                ))}
            </HorizontalCards>

            <HeadingSection className="mb-6" title="Timeline" />
            <Timeline experiences={experiences} className="mb-16" />
        </main>
    );
};
