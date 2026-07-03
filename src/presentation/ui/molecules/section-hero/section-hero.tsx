import React from 'react';

import { Accent, ArrowLink, DottedGrid, Heading, Lead, Meta, Section } from '../../design-system';

export type SectionHeroProps = {
    button?: {
        href: string;
        text: string;
    };
    className?: string;
    description: string;
    meta?: string;
    title: string;
    titleAccent?: string;
};

export const SectionHero: React.FC<SectionHeroProps> = ({
    button,
    className,
    description,
    meta,
    title,
    titleAccent,
}) => (
    <Section className={className} spacing="hero">
        <DottedGrid intensity="medium" origin="top-left" />

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
                    <ArrowLink href={button.href} tone="subtle">
                        {button.text}
                    </ArrowLink>
                )}
                {meta && <Meta>{meta}</Meta>}
            </div>
        )}
    </Section>
);
