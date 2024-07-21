import React from 'react';

import { UserValue } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

export type ValueCardProps = {
    value: UserValue;
    highlighted?: boolean;
    className?: string;
};

export const ValueCard: React.FC<ValueCardProps> = ({ value, className }) => {
    const generatedClassName = mergeClassName('flex-1', className);

    return (
        <div key={value.title} className={generatedClassName}>
            <h5 className="font-semibold text-storm-cloud-accent text-center">{value.title}</h5>
            <div className="h-0.5 bg-storm-cloud-accent mt-1" />
            <div className="text-xs text-storm-cloud mt-2 text-center">{value.description}</div>
        </div>
    );
};
