import React from 'react';

// Utils
import { cn } from '../../../lib/utils';

export type HeadingMainProps = {
    children: string;
    className?: string;
};

export const HeadingMain: React.FC<HeadingMainProps> = ({ children, className = '' }) => {
    const generatedClassName = cn('text-4xl font-black mb-4 tracking-tight', className);

    return <h1 className={generatedClassName}>{children}</h1>;
};
