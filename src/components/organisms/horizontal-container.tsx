import React from 'react';

import { mergeClassName } from '../../lib/utils.js';

export type HorizontalContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export const HorizontalContainer: React.FC<HorizontalContainerProps> = ({
    children,
    className,
}) => {
    const generatedClassName = mergeClassName('flex flex-row space-x-12', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
