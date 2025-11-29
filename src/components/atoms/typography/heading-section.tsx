import React from 'react';

// Utils
import { cn, getTextFromChildren } from '../../../lib/utils';

import { slugify } from '../../../lib/slugify';

export type TitleSectionProps = {
    children: React.ReactNode;
    className?: string;
    id?: string;
};

export const HeadingSection: React.FC<TitleSectionProps> = ({ children, className, id }) => {
    const generatedClassName = cn('text-2xl font-extrabold mb-6', className);
    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h2 className={generatedClassName} id={headingId}>
            {children}
        </h2>
    );
};
