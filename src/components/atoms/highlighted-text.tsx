import React from 'react';

import { cn } from '../../lib/utils.js'; // Import the CSS file

import styles from './highlighted-text.module.scss';

export const HighlightedText = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const generatedClassName = cn(styles['highlight-text'], className);

    return <span className={generatedClassName}>{children}</span>;
};
