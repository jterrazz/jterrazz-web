import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

export enum BadgeColor {
    Green,
    Yellow,
    Orange,
    Gray,
    Blue,
}

export enum DotPulseSize {
    Small,
    Medium,
}

export type StatusBadgeProps = {
    value: string;
    className?: string;
    color: BadgeColor;
    size?: DotPulseSize;
    filled?: boolean;
};

export const Badge: React.FC<StatusBadgeProps> = ({
    value,
    className,
    color,
    size,
    filled = true,
}) => {
    let generatedClassName = mergeClassName('rounded-md', className);

    switch (color) {
        case BadgeColor.Green:
            generatedClassName = mergeClassName(
                generatedClassName,
                'font-medium',
                filled ? ' bg-olive-note text-olive-note-accent' : ' text-olive-note',
            );
            break;
        case BadgeColor.Yellow:
            generatedClassName = mergeClassName(
                generatedClassName,
                'bg-vanilla-punch text-vanilla-punch-accent',
            );
            break;
        case BadgeColor.Blue:
            generatedClassName = mergeClassName(
                generatedClassName,
                'blue-grey blue-grey-accent font-medium',
            );
            break;
        case BadgeColor.Orange:
            generatedClassName = mergeClassName(
                generatedClassName,
                'bg-apricot-sunset text-apricot-sunset-accent',
            );
            break;
        case BadgeColor.Gray:
        default:
            generatedClassName = mergeClassName(
                generatedClassName,
                filled
                    ? ' bg-storm-cloud text-storm-cloud-accent font-medium'
                    : ' text-storm-cloud-accent border-storm-cloud-accent border font-medium',
            );
            break;
    }

    switch (size) {
        case DotPulseSize.Small:
            generatedClassName = mergeClassName(generatedClassName, 'px-2.5 py-1 text-xs');
            break;
        case DotPulseSize.Medium:
        default:
            generatedClassName = mergeClassName(generatedClassName, 'px-2 py-1 text-sm');
            break;
    }

    return <span className={generatedClassName}>{value}</span>;
};
