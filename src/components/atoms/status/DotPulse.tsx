import React from 'react';

import styles from './DotPulse.module.scss';

export enum DotPulseState {
    Success = 'success',
    Failure = 'failure',
    Warning = 'warning',
    Disabled = 'disabled',
}

export type DotPulseProps = {
    state: DotPulseState;
    className?: string;
};

// TODO Template for 4 states

export const DotPulse: React.FC<DotPulseProps> = ({ state, className }) => {
    let generatedClassName = styles.pulse;

    switch (state) {
        case DotPulseState.Success:
            generatedClassName = `${generatedClassName} ${styles.green}`;
            break;
        case DotPulseState.Failure:
            generatedClassName = `${generatedClassName} ${styles.red}`;
            break;
        case DotPulseState.Warning:
            generatedClassName = `${generatedClassName} ${styles.orange}`;
            break;
        case DotPulseState.Disabled:
            generatedClassName = `${generatedClassName} ${styles.black}`;
            break;
    }

    return <i className={generatedClassName + (className ? ` ${className}` : '')}></i>;
};
