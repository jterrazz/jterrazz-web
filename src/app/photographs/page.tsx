import { type Metadata } from 'next';
import Script from 'next/script';

// Infrastructure
import { PhotographInMemoryRepository } from '../../infrastructure/repositories/photograph-in-memory.repository';

import { PhotographsGridTemplate } from '../../components/templates/photographs-grid.template';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

export const metadata: Metadata = {
    alternates: {
        canonical: `${baseUrl}/photographs`,
    },
    description:
        'A collection of photographs taken by Jean-Baptiste Terrazzoni. A simple collection of moments and places that caught my eye.',
    keywords: [
        'Photography',
        'Travel Photography',
        'Jean-Baptiste Terrazzoni',
        'Portfolio',
        'Visual Art',
    ],
    openGraph: {
        description:
            'A collection of photographs taken by Jean-Baptiste Terrazzoni. A simple collection of moments and places that caught my eye.',
        title: 'Photographs by Jean-Baptiste Terrazzoni',
        type: 'website',
        url: `${baseUrl}/photographs`,
    },
    title: 'Photographs by Jean-Baptiste Terrazzoni',
    twitter: {
        card: 'summary_large_image',
        description:
            'A collection of photographs taken by Jean-Baptiste Terrazzoni. A simple collection of moments and places that caught my eye.',
        title: 'Photographs by Jean-Baptiste Terrazzoni',
    },
};

export default function PhotographsPage() {
    const photographsRepository = new PhotographInMemoryRepository();
    const photographs = photographsRepository.getPhotographs();

    const highlightTitle = 'Photographs';
    const highlightDescription =
        'The world as I see it. A simple collection of moments and places that caught my eye.';

    // Structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description:
            'A collection of photographs taken by Jean-Baptiste Terrazzoni. A simple collection of moments and places that caught my eye.',
        hasPart: photographs.map((photo) => ({
            '@type': 'ImageObject',
            author: {
                '@type': 'Person',
                name: 'Jean-Baptiste Terrazzoni',
                url: 'https://jterrazz.com',
            },
            contentUrl: photo.contentUrl,
            description: photo.metadata.description,
            name: photo.metadata.description,
            thumbnailUrl: photo.contentUrl,
        })),
        name: 'Photographs by Jean-Baptiste Terrazzoni',
        url: `${baseUrl}/photographs`,
    };

    return (
        <>
            <Script
                id="photographs-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>
            <PhotographsGridTemplate
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
                photographs={photographs}
            />
        </>
    );
}
