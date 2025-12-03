import React from 'react';

import { cn, getTextFromChildren } from '../../../utils';

import { slugify } from '../../../../domain/utils/slugify';

export type HeadingH3Props = {
    children: React.ReactNode;
    className?: string;
    id?: string;
    size?: 'large' | 'medium' | 'small';
};

export const HeadingH3: React.FC<HeadingH3Props> = ({
    children,
    className = '',
    id,
    size = 'medium',
}) => {
    let generatedClassName = className;

    switch (size) {
        case 'large':
            generatedClassName = cn(generatedClassName, 'text-lg md:text-xl font-bold mb-4');
            break;
        case 'medium':
            generatedClassName = cn(generatedClassName, 'text-base md:text-lg font-bold mb-2');
            break;
        case 'small':
            generatedClassName = cn(generatedClassName, 'text-sm md:text-base font-bold mb-1');
            break;
    }

    const headingId = id || slugify(getTextFromChildren(children));

    return (
        <h3 className={generatedClassName} id={headingId}>
            {children}
        </h3>
    );
};
