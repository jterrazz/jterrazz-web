import React from 'react';

import { type Metadata } from 'next';

// Infrastructure
import { PhotographInMemoryRepository } from '../../infrastructure/repositories/photograph-in-memory.repository.js';

import { PhotographsGridTemplate } from '../../components/templates/photographs-grid.template.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    description: 'A collection of photographs taken by me.',
    title: 'Photographs - Jterrazz',
};

export default function PhotographsPage() {
    const photographsRepository = new PhotographInMemoryRepository();
    const photographs = photographsRepository.getPhotographs();

    const highlightTitle = 'Photographs';
    const highlightDescription = 'A collection of photographs taken by me.';

    return (
        <PhotographsGridTemplate
            highlightDescription={highlightDescription}
            highlightTitle={highlightTitle}
            photographs={photographs}
        />
    );
}
