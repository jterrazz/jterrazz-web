import React from 'react';

import { HeadingMain } from '../../atoms/typography/Heading.Main.js';

export type HighlightProps = {
    title: string;
    description: string;
    className?: string;
};

export const Highlight: React.FC<HighlightProps> = ({ title, className, description }) => {
    return (
        <div className={className}>
            <HeadingMain>{title}</HeadingMain>
            <p className="mt-6">{description}</p>
        </div>
    );
};
