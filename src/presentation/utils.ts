import React, { type ReactElement, type ReactNode } from 'react';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getTextFromChildren(children: ReactNode): string {
    if (!children) return '';
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(getTextFromChildren).join('');

    // Handle React elements
    if (React.isValidElement(children)) {
        const element = children as ReactElement<{ children?: ReactNode }>;
        if (element.type === 'br') return '\n';
        return getTextFromChildren(element.props.children);
    }

    return '';
}
