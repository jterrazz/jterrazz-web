'use client';

import React, { useEffect, useState } from 'react';
import { ImageGallery } from 'react-image-grid-gallery';

import 'react-image-grid-gallery/style.css';

// Domain
import { type Photograph } from '../../domain/photograph';
import { UserContactType } from '../../domain/user';
// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { Container } from '../ui/design-system';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

type PhotographsGridTranslations = {
    viewPexels: string;
};

export type PhotographsGridTemplateProps = {
    highlightDescription: string;
    highlightTitle: string;
    photographs: Photograph[];
    translations: PhotographsGridTranslations;
};

function useScrollGrayscale(): boolean {
    const [isGrayscale, setIsGrayscale] = useState(true);

    useEffect(() => {
        const threshold = 150;

        const handleScroll = (): void => {
            const scrollY = window.scrollY;
            setIsGrayscale(scrollY < threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isGrayscale;
}

export const PhotographsGridTemplate: React.FC<PhotographsGridTemplateProps> = ({
    highlightDescription,
    highlightTitle,
    photographs,
    translations: t,
}) => {
    const isGrayscale = useScrollGrayscale();

    const images = photographs.map((photograph, index) => ({
        alt: photograph.metadata.description,
        id: `photograph-${photograph.index || index}`,
        src: photograph.contentUrl,
        title: photograph.metadata.description,
    }));
    const button = {
        href: userRepository.getContact(UserContactType.Pexels).url.toString(),
        text: t.viewPexels,
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <Container>
                <SectionHero
                    button={button}
                    description={highlightDescription}
                    title={highlightTitle}
                />
            </Container>

            {/* Gallery Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div
                    className={`transition-[filter] duration-700 ease-out ${isGrayscale ? 'grayscale' : 'grayscale-0'}`}
                >
                    <ImageGallery columnCount={3} gapSize={24} imagesData={images} />
                </div>
            </div>
        </div>
    );
};
