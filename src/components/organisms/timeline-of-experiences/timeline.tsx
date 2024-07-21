import React from 'react';

type TimelineProps = {
    className?: string;
    children?: React.ReactNode;
};

export const Timeline: React.FC<TimelineProps> = ({ className, children }) => {
    return <div className={className}>{children}</div>;
};
