import React from 'react';

// Domain
import { slugify } from '../../../../domain/utils/slugify';

// Utils
import { cn, getTextFromChildren } from '../../../utils';

export type HeadingH1Props = {
    children?: React.ReactNode;
    className?: string;
    id?: string;
};

export const HeadingH1: React.FC<HeadingH1Props> = ({ children, className = '', id }) => {
    const generatedClassName = cn(
        'text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight',
        className,
    );
    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h1 className={generatedClassName} id={headingId}>
            {children}
        </h1>
    );
};
