import React from 'react';

import { cn } from '../../utils';

// Uniform horizontal container. Three widths cover the real variants
// Found in the app: reading width, default page width, and gallery width.
const WIDTH_STYLES = {
    default: 'max-w-180', // 45rem — between 2xl and 3xl, the editorial column
    narrow: 'max-w-xl',
    // Site shell: navbar and footer. Follows the widest container the page
    // Declares (see --shell-width in globals.css) so the frame always matches
    // The content — 6xl by default, wider when the page is wide.
    shell: 'max-w-(--shell-width)',
    wide: 'max-w-7xl',
} as const;

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
    width?: keyof typeof WIDTH_STYLES;
};

// Pages advertise their content width so the shell (navbar/footer) can match
// It via CSS alone — see `body:has([data-shell])` in globals.css. Wide wins
// Over reading when a page renders both.
const SHELL_HINTS: Partial<Record<keyof typeof WIDTH_STYLES, string>> = {
    default: 'reading',
    wide: 'wide',
};

export const Container: React.FC<ContainerProps> = ({ children, className, width = 'default' }) => (
    <div
        className={cn('mx-auto w-full px-4 md:px-6', WIDTH_STYLES[width], className)}
        data-shell={SHELL_HINTS[width]}
    >
        {children}
    </div>
);
