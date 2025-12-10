// Infrastructure
import { photographsRepository } from '../../infrastructure/repositories/photographs.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';
import {
    buildCollectionPageJsonLd,
    buildImageObjectJsonLd,
} from '../../infrastructure/seo/json-ld';

import { PhotographsGridTemplate } from '../../presentation/templates/photographs-grid.template';
import { JsonLdScript } from '../../presentation/ui/atoms/json-ld-script/json-ld-script';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const PAGE_DESCRIPTION =
    'Photography portfolio featuring travel, street, and everyday moments. A visual journal capturing authentic scenes from around the world.';

export const metadata = buildMetadata({
    description: PAGE_DESCRIPTION,
    keywords: [
        'Photography',
        'Travel Photography',
        'Jean-Baptiste Terrazzoni',
        'Portfolio',
        'Visual Art',
    ],
    path: '/photographs',
    title: 'Photographs',
});

export default function PhotographsPage() {
    const photographs = photographsRepository.getAll();

    const highlightTitle = 'Photographs';
    const highlightDescription =
        'The world as I see it. A simple collection of moments and places that caught my eye.';

    const jsonLd = buildCollectionPageJsonLd({
        description: PAGE_DESCRIPTION,
        items: photographs.map((photo) =>
            buildImageObjectJsonLd({
                contentUrl: photo.contentUrl,
                description: photo.metadata.description,
            }),
        ),
        name: 'Through My Lens: A Visual Journal',
        url: metadata.openGraph?.url as string,
    });

    return (
        <>
            <JsonLdScript data={jsonLd} id="photographs-json-ld" />
            <PhotographsGridTemplate
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
                photographs={photographs}
            />
        </>
    );
}
