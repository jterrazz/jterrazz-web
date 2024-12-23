'use client';

import React from 'react';
import { ImageGallery } from 'react-image-grid-gallery';

import { Photograph } from '../../domain/photograph.js';
import { UserContactType } from '../../domain/user.js';

import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';

export type PhotographsGridTemplateProps = {
    highlightTitle: string;
    highlightDescription: string;
    photographs: Photograph[];
};

export const PhotographsGridTemplate: React.FC<PhotographsGridTemplateProps> = ({
    highlightTitle,
    highlightDescription,
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
            <Highlight title={highlightTitle} description={highlightDescription} button={button} />
            <ImageGallery imagesInfoArray={images} columnCount={3} gapSize={20} />
        </MainContainer>
    );
};
