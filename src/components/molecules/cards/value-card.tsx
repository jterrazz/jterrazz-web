import React from 'react';

import { UserValue } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

export type ValueCardProps = {
    value: UserValue;
    highlighted?: boolean;
    className?: string;
};

export const ValueCard: React.FC<ValueCardProps> = ({ value, className }) => {
    const generatedClassName = mergeClassName('flex-1 p-4 flex flex-col items-center', className);

    return (
        <div key={value.title} className={generatedClassName}>
            <h5 className="font-extrabold text-gray-100 text-center mb-2">{value.title}</h5>
            <div className="text-xs text-center font-bold text-gray-200">{value.description}</div>
        </div>
    );
};
