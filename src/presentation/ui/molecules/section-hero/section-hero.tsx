import React from 'react';

import {
    Accent,
    ArrowLink,
    DottedGrid,
    Heading,
    Kicker,
    Lead,
    Meta,
    Section,
} from '../../design-system';

export type SectionHeroProps = {
    button?: {
        href: string;
        text: string;
    };
    className?: string;
    description: string;
    kicker?: string;
    meta?: string;
    title: string;
    titleAccent?: string;
};

export const SectionHero: React.FC<SectionHeroProps> = ({
    button,
    className,
    description,
    kicker,
    meta,
    title,
    titleAccent,
}) => (
    <Section className={className} spacing="hero">
        <DottedGrid intensity="medium" origin="top-left" />

        {kicker && <Kicker className="mb-6">{kicker}</Kicker>}

        <Heading className="mb-6" size="display">
            {title}
            {titleAccent && (
                <>
                    {' '}
                    <Accent>{titleAccent}</Accent>
                </>
            )}
        </Heading>

        <Lead>{description}</Lead>

        {(button || meta) && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {button && (
                    <ArrowLink href={button.href} tone="subtle" variant="mono">
                        {button.text}
                    </ArrowLink>
                )}
                {meta && <Meta>{meta}</Meta>}
            </div>
        )}
    </Section>
);
