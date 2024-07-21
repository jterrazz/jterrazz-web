import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

export type HeadingSubSectionProps = {
    children: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
};

export const HeadingSubSection: React.FC<HeadingSubSectionProps> = ({
    children,
    size = 'medium',
    className = '',
}) => {
    let generatedClassName = className;

    switch (size) {
        case 'small':
            generatedClassName = mergeClassName(generatedClassName, 'text-sm font-bold mb-1');
            break;
        case 'medium':
            generatedClassName = mergeClassName(generatedClassName, 'text-md font-bold mb-2');
            break;
        case 'large':
            generatedClassName = mergeClassName(generatedClassName, 'text-lg font-bold mb-4');
            break;
    }

    return <h3 className={generatedClassName}>{children}</h3>;
};
