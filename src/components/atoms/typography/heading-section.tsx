import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

export type TitleSectionProps = {
    children: React.ReactNode;
    className?: string;
};

export const HeadingSection: React.FC<TitleSectionProps> = ({ children, className }) => {
    const generatedClassName = mergeClassName('text-2xl font-extrabold mb-6', className);

    return <h2 className={generatedClassName}>{children}</h2>;
};
