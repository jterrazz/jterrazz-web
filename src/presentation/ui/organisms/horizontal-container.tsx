import React from 'react';

// Utils
import { cn } from '../../utils';

export type HorizontalContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export const HorizontalContainer: React.FC<HorizontalContainerProps> = ({
    children,
    className,
}) => {
    const generatedClassName = cn('flex flex-row space-x-12', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
