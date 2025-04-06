import React from 'react';

import { cn } from '../../../lib/utils.js';

export type HeadingMainProps = {
    children: string;
    className?: string;
};

export const HeadingMain: React.FC<HeadingMainProps> = ({ children, className = '' }) => {
    const generatedClassName = cn('text-4xl font-black mb-6 tracking-wide', className);

    return <h1 className={generatedClassName}>{children}</h1>;
};
