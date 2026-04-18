import React from 'react';

import { cn } from '../../utils';

// Uniform horizontal container. Three widths cover the real variants
// found in the app: reading width, default page width, and gallery width.
const WIDTH_STYLES = {
    default: 'max-w-3xl',
    narrow: 'max-w-2xl',
    wide: 'max-w-7xl',
} as const;

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
    width?: keyof typeof WIDTH_STYLES;
};

export const Container: React.FC<ContainerProps> = ({
    children,
    className,
    width = 'default',
}) => (
    <div className={cn('mx-auto w-full px-4 md:px-6', WIDTH_STYLES[width], className)}>
        {children}
    </div>
);
