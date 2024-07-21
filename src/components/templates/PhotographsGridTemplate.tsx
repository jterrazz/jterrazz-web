'use client';

import React from 'react';
import { ImageGallery } from 'react-image-grid-gallery';

import { Photograph } from '../../domain/photograph/photograph.js';

import { Highlight } from '../molecules/typography/Highlight.jsx';

export type PhotographGridTemplateProps = {
    photographs: Photograph[];
};

export const PhotographsGridTemplate: React.FC<PhotographGridTemplateProps> = ({ photographs }) => {
    const images = photographs.map((photograph) => ({
        alt: photograph.metadata.description,
        src: photograph.imageUrl,
        title: photograph.metadata.description,
    }));

    return (
        <main
            className="w-full flex flex-col self-center justify-self-center py-5 px-5"
            style={{
                maxWidth: 1300,
            }}
        >
            <Highlight
                className="my-20"
                title="Photographs"
                description="Explore some of my photographs!"
            />
            <ImageGallery imagesInfoArray={images} columnCount={3} gapSize={20} />
        </main>
    );
};
