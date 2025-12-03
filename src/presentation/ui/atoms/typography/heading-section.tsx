import React from 'react';

// Utils
import { cn, getTextFromChildren } from '../../../utils';

import { slugify } from '../../../../domain/utils/slugify';

export type TitleSectionProps = {
    children: React.ReactNode;
    className?: string;
    id?: string;
};

export const HeadingSection: React.FC<TitleSectionProps> = ({ children, className, id }) => {
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
