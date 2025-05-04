import React from 'react';

import { cn } from '../../../lib/utils.js';

import styles from './dot-pulse.module.scss';

export enum DotPulseColor {
    Black = 'black',
    Blue = 'blue',
    Gray = 'gray',
    Green = 'green',
    Orange = 'orange',
    Red = 'red',
}

export type DotPulseProps = {
    className?: string;
    color: DotPulseColor;
};

export const DotPulse: React.FC<DotPulseProps> = ({ className, color }) => {
    let generatedClassName = cn(className, styles.pulse);

    switch (color) {
        case DotPulseColor.Black:
            generatedClassName = cn(generatedClassName, styles.black);
            break;
        case DotPulseColor.Blue:
            generatedClassName = cn(generatedClassName, styles.blue);
            break;
        case DotPulseColor.Gray:
            generatedClassName = cn(generatedClassName, styles.gray);
            break;
        case DotPulseColor.Green:
            generatedClassName = cn(generatedClassName, styles.green);
            break;
        case DotPulseColor.Orange:
            generatedClassName = cn(generatedClassName, styles.orange);
            break;
        case DotPulseColor.Red:
            generatedClassName = cn(generatedClassName, styles.red);
            break;
    }

    return <i className={generatedClassName}></i>;
};
