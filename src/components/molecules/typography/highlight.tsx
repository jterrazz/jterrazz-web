import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

import { HeadingMain } from '../../atoms/typography/heading-main.js';

export type HighlightProps = {
    title: string;
    description: string;
    className?: string;
};

export const Highlight: React.FC<HighlightProps> = ({ title, className, description }) => {
    const generatedClassName = mergeClassName('mb-20', className);

    return (
        <div className={generatedClassName}>
            <HeadingMain>{title}</HeadingMain>
            <p className="mt-6 font-medium">{description}</p>
        </div>
    );
};
