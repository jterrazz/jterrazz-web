import React from 'react';

// Utils
import { slugify } from '../../../lib/slugify';
import { cn, getTextFromChildren } from '../../../lib/utils';

export type HeadingMainProps = {
    children: React.ReactNode;
    className?: string;
    id?: string;
};

export const HeadingMain: React.FC<HeadingMainProps> = ({ children, className = '', id }) => {
    const generatedClassName = cn('text-4xl font-black mb-4 tracking-tight', className);
    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h1 className={generatedClassName} id={headingId}>
            {children}
        </h1>
    );
};
