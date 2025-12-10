'use client';

import React from 'react';

import NextLink from 'next/link';

import { useLocale } from '../../presentation/context/locale-context';

type LinkProps = React.ComponentProps<typeof NextLink>;

/**
 * Locale-aware Link component
 * @description Automatically prefixes internal links with the current locale
 */
export function Link({ href, ...props }: LinkProps) {
    const { localePath } = useLocale();

    // Only process internal string links
    if (typeof href === 'string' && href.startsWith('/')) {
        href = localePath(href);
    }

    return <NextLink href={href} {...props} />;
}

