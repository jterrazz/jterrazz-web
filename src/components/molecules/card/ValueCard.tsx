import React from 'react';

export type Value = {
    description: string;
    title: string;
};

export type ValueCardProps = {
    value: Value;
    highlighted?: boolean;
};

export const ValueCard: React.FC<ValueCardProps> = ({ value }) => {
    return (
        <div key={value.title} className="mr-4 flex-1">
            <h5 className="font-semibold text-storm-cloud-accent">{value.title}</h5>
            <div className="h-0.5 bg-storm-cloud-accent mt-1" />
            <div className="text-xs text-storm-cloud mt-2">{value.description}</div>
        </div>
    );
};
