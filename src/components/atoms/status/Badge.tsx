import React from 'react';

export enum StatusBadgeState {
    Success,
    Failure,
    Warning,
    Disabled,
}

export enum DotPulseSize {
    Small,
    Medium,
}

export type StatusBadgeProps = {
    value: string;
    className?: string;
    state: StatusBadgeState;
    size?: DotPulseSize;
    filled?: boolean;
};

export const Badge: React.FC<StatusBadgeProps> = ({
    value,
    className,
    state,
    size,
    filled = true,
}) => {
    let generatedClassName = 'rounded-md';

    switch (state) {
        case StatusBadgeState.Success:
            generatedClassName += filled
                ? ' bg-olive-note text-olive-note-accent'
                : ' text-olive-note';
            break;
        case StatusBadgeState.Failure:
            generatedClassName += ' bg-vanilla-punch text-vanilla-punch-accent';
            break;
        case StatusBadgeState.Warning:
            generatedClassName += ' bg-apricot-sunset text-apricot-sunset-accent';
            break;
        case StatusBadgeState.Disabled:
        default:
            generatedClassName += filled
                ? ' bg-storm-cloud text-white'
                : ' text-storm-cloud-accent border-storm-cloud-accent border bg-white';
            break;
    }

    switch (size) {
        case DotPulseSize.Small:
            generatedClassName += ' px-2.5 py-1 text-xs';
            break;
        case DotPulseSize.Medium:
        default:
            generatedClassName += ' px-2 py-1 text-sm';
            break;
    }

    if (className) {
        generatedClassName += ` ${className}`;
    }

    return (
        <li>
            <span className={generatedClassName}>{value}</span>
        </li>
    );
};
