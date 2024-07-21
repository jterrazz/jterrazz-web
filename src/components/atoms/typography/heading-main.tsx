import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

export type HeadingMainProps = {
    children: string;
    className?: string;
};

export const HeadingMain: React.FC<HeadingMainProps> = ({ children, className = '' }) => {
    const generatedClassName = mergeClassName('text-4xl font-black mb-6 tracking-wide', className);

    return <h1 className={generatedClassName}>{children}</h1>;
};
