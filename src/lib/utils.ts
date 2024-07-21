import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and combines CSS class names using clsx and tailwind-merge.
 *
 * @param inputs - An array of class names or objects representing class conditions.
 * @returns A string of merged and optimized class names.
 */
export function mergeClassName(...inputs: ClassValue[]): string {
    const combinedClasses = clsx(inputs);

    return twMerge(combinedClasses);
}
