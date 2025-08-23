import React from 'react';

// Utils
import { cn } from '../../../lib/utils.js';

export type HeadingSubSectionProps = {
    children: string;
    className?: string;
    size?: 'large' | 'medium' | 'small';
};

export const HeadingSubSection: React.FC<HeadingSubSectionProps> = ({
    children,
    className = '',
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

    return <h3 className={generatedClassName}>{children}</h3>;
};
