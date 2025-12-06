import React from 'react';

// Domain
import { slugify } from '../../../../domain/utils/slugify';

// Utils
import { cn, getTextFromChildren } from '../../../utils';

export type HeadingH2Props = {
    children?: React.ReactNode;
    className?: string;
    id?: string;
};

export const HeadingH2: React.FC<HeadingH2Props> = ({ children, className, id }) => {
    const generatedClassName = cn(
        'text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6',
        className,
    );
    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h2 className={generatedClassName} id={headingId}>
            {children}
        </h2>
    );
};
