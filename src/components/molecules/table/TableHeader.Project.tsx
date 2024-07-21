import React from 'react';

export type TableHeaderProjectProps = {
    className?: string;
};

export const TableHeaderProject: React.FC<TableHeaderProjectProps> = ({ className = '' }) => {
    const generatedClassName = `flex items-center justify-between ${className}`;

    return (
        <div className={generatedClassName}>
            <p className="text-xs text-storm-cloud">Select a project for more</p>
            <div className="text-xs">
                Star - All status - All technologies (+ with article + with architecture)
            </div>
        </div>
    );
};
