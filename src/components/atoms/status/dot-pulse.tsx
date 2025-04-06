import React from 'react';

import { cn } from '../../../lib/utils.js';

import styles from './dot-pulse.module.scss';

export enum DotPulseColor {
    Green = 'green',
    Red = 'red',
    Orange = 'orange',
    Black = 'black',
    Gray = 'gray',
    Blue = 'blue',
}

export type DotPulseProps = {
    color: DotPulseColor;
    className?: string;
};

export const DotPulse: React.FC<DotPulseProps> = ({ color, className }) => {
    let generatedClassName = cn(className, styles.pulse);

    switch (color) {
        case DotPulseColor.Green:
            generatedClassName = cn(generatedClassName, styles.green);
            break;
        case DotPulseColor.Red:
            generatedClassName = cn(generatedClassName, styles.red);
            break;
        case DotPulseColor.Orange:
            generatedClassName = cn(generatedClassName, styles.orange);
            break;
        case DotPulseColor.Black:
            generatedClassName = cn(generatedClassName, styles.black);
            break;
        case DotPulseColor.Gray:
            generatedClassName = cn(generatedClassName, styles.gray);
            break;
        case DotPulseColor.Blue:
            generatedClassName = cn(generatedClassName, styles.blue);
            break;
    }

    return <i className={generatedClassName}></i>;
};
