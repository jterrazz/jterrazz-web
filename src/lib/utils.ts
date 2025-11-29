import { type ClassValue, clsx } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getTextFromChildren(children: React.ReactNode): string {
    if (!children) return '';
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
    
    // Handle React elements
    if (React.isValidElement(children)) {
        return getTextFromChildren(children.props.children);
    }
    
    return '';
}
