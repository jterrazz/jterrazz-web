import React from 'react';

// Utils
import { cn } from '../../lib/utils';

type MainContainerProps = {
    children: React.ReactNode;
    className?: string;
    size?: 'full' | 'medium';
};

export const MainContainer: React.FC<MainContainerProps> = ({
    children,
    className,
    size = 'medium',
}) => {
    const generatedClassName = cn(
        'w-full flex flex-col self-center justify-self-center px-5 my-8 md:my-12 mx-auto',
        size === 'medium' ? 'max-w-3xl' : 'max-w-5xl',
        className,
    );

    return <main className={generatedClassName}>{children}</main>;
};
