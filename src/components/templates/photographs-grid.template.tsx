'use client';

import React from 'react';
import { ImageGallery } from 'react-image-grid-gallery';

import { type Photograph } from '../../domain/photograph.js';
import { UserContactType } from '../../domain/user.js';

import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';

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
    const images = photographs.map((photograph) => ({
        alt: photograph.metadata.description,
        src: photograph.contentUrl,
        title: photograph.metadata.description,
    }));
    const button = {
        href: new UserInMemoryRepository().getContact(UserContactType.Pexels).url.toString(),
        text: 'Follow me on Pexels',
    };

    return (
        <MainContainer size="full">
            <Highlight button={button} description={highlightDescription} title={highlightTitle} />
            <ImageGallery columnCount={3} gapSize={20} imagesInfoArray={images} />
        </MainContainer>
    );
};
