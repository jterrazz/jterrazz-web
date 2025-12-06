import { type Metadata } from 'next';
import Script from 'next/script';

// Infrastructure
import { photographsRepository } from '../../infrastructure/repositories/photographs.repository';

import { PhotographsGridTemplate } from '../../presentation/templates/photographs-grid.template';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

export const metadata: Metadata = {
    alternates: {
        canonical: `${baseUrl}/photographs`,
    },
    description:
        'Photography portfolio featuring travel, street, and everyday moments. A visual journal capturing authentic scenes from around the world.',
    keywords: [
        'Photography',
        'Travel Photography',
        'Jean-Baptiste Terrazzoni',
        'Portfolio',
        'Visual Art',
    ],
    openGraph: {
        description:
            'Photography portfolio featuring travel, street, and everyday moments. A visual journal capturing authentic scenes from around the world.',
        title: 'Photographs | Jean-Baptiste Terrazzoni',
        type: 'website',
        url: `${baseUrl}/photographs`,
    },
    title: 'Photographs',
    twitter: {
        card: 'summary_large_image',
        description:
            'Photography portfolio featuring travel, street, and everyday moments. A visual journal capturing authentic scenes from around the world.',
        title: 'Photographs | Jean-Baptiste Terrazzoni',
    },
};

export default function PhotographsPage() {
    const photographs = photographsRepository.getAll();

    const highlightTitle = 'Photographs';
    const highlightDescription =
        'The world as I see it. A simple collection of moments and places that caught my eye.';

    // Structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description:
            'Photography portfolio featuring travel, street, and everyday moments by Jean-Baptiste Terrazzoni.',
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
