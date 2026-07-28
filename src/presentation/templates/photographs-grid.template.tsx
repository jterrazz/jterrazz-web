'use client';

import React, { useEffect, useState } from 'react';

// Domain
import { type Photograph } from '../../domain/photograph';
import { UserContactType } from '../../domain/user';
// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { Container } from '../ui/design-system';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';
import { PhotographGallery } from '../ui/organisms/photograph-gallery/photograph-gallery';

type PhotographsGridTranslations = {
    closePhotograph: string;
    nextPhotograph: string;
    previousPhotograph: string;
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

    const button = {
        href: userRepository.getContact(UserContactType.Pexels).url.toString(),
        text: t.viewPexels,
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <Container width="shell">
                <SectionHero
                    button={button}
                    description={highlightDescription}
                    title={highlightTitle}
                />
            </Container>

            {/* Gallery Content */}
            <Container className="pb-24" width="wide">
                <div
                    className={`transition-[filter] duration-700 ease-out ${isGrayscale ? 'grayscale' : 'grayscale-0'}`}
                >
                    <PhotographGallery
                        closeLabel={t.closePhotograph}
                        nextLabel={t.nextPhotograph}
                        photographs={photographs}
                        previousLabel={t.previousPhotograph}
                    />
                </div>
            </Container>
        </div>
    );
};
