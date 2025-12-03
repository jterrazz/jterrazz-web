import React from 'react';

import { cn } from '../../../utils';

type ExperimentTableProps = {
    children: React.ReactNode;
    className?: string;
};

export const ExperimentTable: React.FC<ExperimentTableProps> = ({ children, className }) => {
    const generatedClassName = cn('flex flex-col select-none', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
