'use client';

import React, { useEffect, useState } from 'react';

import { ImageGallery } from 'react-image-grid-gallery';

// Domain
import { type Photograph } from '../../domain/photograph';
import { UserContactType } from '../../domain/user';

// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';

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

function useScrollGrayscale(): number {
    const [grayscale, setGrayscale] = useState(1);

    useEffect(() => {
        const handleScroll = (): void => {
            const scrollY = window.scrollY;
            const transitionStart = 50;
            const transitionEnd = 300;

            if (scrollY <= transitionStart) {
                setGrayscale(1);
            } else if (scrollY >= transitionEnd) {
                setGrayscale(0);
            } else {
                const progress = (scrollY - transitionStart) / (transitionEnd - transitionStart);
                setGrayscale(1 - progress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return grayscale;
}

export const PhotographsGridTemplate: React.FC<PhotographsGridTemplateProps> = ({
    highlightDescription,
    highlightTitle,
    photographs,
    translations: t,
}) => {
    const grayscale = useScrollGrayscale();

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
                <div
                    className="transition-[filter] duration-150"
                    style={{ filter: `grayscale(${grayscale})` }}
                >
                    <ImageGallery columnCount={3} gapSize={24} imagesInfoArray={images} />
                </div>
            </div>
        </div>
    );
};
