import React from 'react';

// Utils
import { cn } from '../../lib/utils.js';

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
        'w-full flex flex-col self-center justify-self-center px-5 my-6 md:my-20',
        className,
    );

    return (
        <main
            className={generatedClassName}
            style={{
                maxWidth: size === 'medium' ? '700px' : '950px',
            }}
        >
            {children}
        </main>
    );
};
