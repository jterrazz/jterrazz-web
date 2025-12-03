'use client';

import React from 'react';

import { ImageGallery } from 'react-image-grid-gallery';

import { userRepository } from '../../infrastructure/repositories/user.repository';
import { type Photograph } from '../../domain/photograph';
import { UserContactType } from '../../domain/user';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

export type PhotographsGridTemplateProps = {
    highlightDescription: string;
    highlightTitle: string;
    photographs: Photograph[];
};

export const PhotographsGridTemplate: React.FC<PhotographsGridTemplateProps> = ({
    highlightDescription,
    highlightTitle,
    photographs,
}) => {
    const images = photographs.map((photograph, index) => ({
        alt: photograph.metadata.description,
        id: `photograph-${photograph.index || index}`,
        src: photograph.contentUrl,
        title: photograph.metadata.description,
    }));
    const button = {
        href: userRepository.getContact(UserContactType.Pexels).url.toString(),
        text: 'View Pexels',
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900 mb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <SectionHero
                        button={button}
                        description={highlightDescription}
                        title={highlightTitle}
                    />
                </div>
            </div>

            {/* Gallery Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="grayscale hover:grayscale-0 transition-all duration-700">
                    <ImageGallery columnCount={3} gapSize={24} imagesInfoArray={images} />
                </div>
            </div>
        </div>
    );
};
