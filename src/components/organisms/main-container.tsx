import React from 'react';

import { cn } from '../../lib/utils.js';

type MainContainerProps = {
    size?: 'medium' | 'full';
    children: React.ReactNode;
    className?: string;
};

export const MainContainer: React.FC<MainContainerProps> = ({
    children,
    size = 'medium',
    className,
}) => {
    const generatedClassName = cn(
        'w-full flex flex-col self-center justify-self-center px-5 my-6 md:my-20',
        className,
    );

    return (
        <main
            className={generatedClassName}
            style={{
                maxWidth: size === 'medium' ? '700px' : '1300px',
            }}
        >
            {children}
        </main>
    );
};
