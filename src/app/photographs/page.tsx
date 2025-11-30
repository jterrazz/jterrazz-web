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
        'Capturing the world as I see it. A simple, authentic collection of moments from my travels and daily life.',
    keywords: [
        'Photography',
        'Travel Photography',
        'Jean-Baptiste Terrazzoni',
        'Portfolio',
        'Visual Art',
    ],
    openGraph: {
        description:
            'Capturing the world as I see it. A simple, authentic collection of moments from my travels and daily life.',
        title: 'Through My Lens: A Visual Journal',
        type: 'website',
        url: `${baseUrl}/photographs`,
    },
    title: 'Through My Lens: A Visual Journal',
    twitter: {
        card: 'summary_large_image',
        description:
            'Capturing the world as I see it. A simple, authentic collection of moments from my travels and daily life.',
        title: 'Through My Lens: A Visual Journal',
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
            'Capturing the world as I see it. A simple, authentic collection of moments from my travels and daily life.',
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
        name: 'Through My Lens: A Visual Journal',
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
