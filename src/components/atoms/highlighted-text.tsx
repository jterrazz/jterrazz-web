import React from 'react';

// Utils
import { cn } from '../../lib/utils'; // Import the CSS file

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
