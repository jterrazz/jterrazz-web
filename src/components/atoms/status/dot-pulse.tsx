import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

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
    let generatedClassName = mergeClassName(className, styles.pulse);

    switch (color) {
        case DotPulseColor.Green:
            generatedClassName = mergeClassName(generatedClassName, styles.green);
            break;
        case DotPulseColor.Red:
            generatedClassName = mergeClassName(generatedClassName, styles.red);
            break;
        case DotPulseColor.Orange:
            generatedClassName = mergeClassName(generatedClassName, styles.orange);
            break;
        case DotPulseColor.Black:
            generatedClassName = mergeClassName(generatedClassName, styles.black);
            break;
        case DotPulseColor.Gray:
            generatedClassName = mergeClassName(generatedClassName, styles.gray);
            break;
        case DotPulseColor.Blue:
            generatedClassName = mergeClassName(generatedClassName, styles.blue);
            break;
    }

    return <i className={generatedClassName}></i>;
};
