import React from 'react';

// Utils
import { slugify } from '../../../lib/slugify';
import { cn, getTextFromChildren } from '../../../lib/utils';

export type HeadingSubSectionProps = {
    children: React.ReactNode;
    className?: string;
    id?: string;
    size?: 'large' | 'medium' | 'small';
};

export const HeadingSubSection: React.FC<HeadingSubSectionProps> = ({
    children,
    className = '',
    id,
    size = 'medium',
}) => {
    let generatedClassName = className;

    switch (size) {
        case 'large':
            generatedClassName = cn(generatedClassName, 'text-lg font-bold mb-4');
            break;
        case 'medium':
            generatedClassName = cn(generatedClassName, 'text-md font-bold mb-2');
            break;
        case 'small':
            generatedClassName = cn(generatedClassName, 'text-sm font-bold mb-1');
            break;
    }

    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h3 className={generatedClassName} id={headingId}>
            {children}
        </h3>
    );
};
