'use client';

import React from 'react';

import dynamic from 'next/dynamic';

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

const ClientProviders = dynamic(
    () => import('./client-providers.js').then((mod) => ({ default: mod.ClientProviders })),
    {
        loading: () => null,
        ssr: false,
    },
);

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
    return (
        <>
            <SpeedInsights sampleRate={1} />
            <Analytics />
            <ClientProviders>{children}</ClientProviders>
        </>
    );
}
