'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { ThemeProvider } from './theme/theme-provider';

// Dynamically load analytics to prevent SSR issues
const Analytics = dynamic(
    () => import('@vercel/analytics/react').then((mod) => ({ default: mod.Analytics })),
    {
        ssr: false,
    },
);

const SpeedInsights = dynamic(
    () => import('@vercel/speed-insights/next').then((mod) => ({ default: mod.SpeedInsights })),
    {
        ssr: false,
    },
);

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
    return (
        <ThemeProvider>
            <SpeedInsights sampleRate={1} />
            <Analytics />
            {children}
        </ThemeProvider>
    );
}
