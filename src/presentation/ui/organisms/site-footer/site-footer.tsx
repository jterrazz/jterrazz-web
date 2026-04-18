'use client';

import {
    IconArticleFilled,
    IconBrandGithubFilled,
    IconBrandLinkedinFilled,
    IconBrandXFilled,
    IconCameraFilled,
    IconMailFilled,
} from '@tabler/icons-react';
import Image from 'next/image';
import Script from 'next/script';
import React from 'react';

// Domain
import { UserContactType } from '../../../../domain/user';
// Infrastructure
import { userRepository } from '../../../../infrastructure/repositories/user.repository';
// DS
import { Container, Heading, Lead, Meta } from '../../design-system';
// Utils
import { cn } from '../../../utils';
import { ToggleTheme } from '../../molecules/toggle-theme/toggle-theme';

const featuredApps = [
    {
        href: 'https://jterrazz.com',
        iconUrl: '/assets/icons/appicon-jterrazz.png',
        name: 'Jterrazz',
    },
    {
        href: '/go/signew',
        iconUrl: '/assets/icons/appicon-signews.png',
        name: 'SigNews',
    },
];

type SiteFooterTranslations = {
    allRightsReserved: string;
    opensInNewTab: string;
    tagline: string;
};

type SiteFooterProps = {
    className?: string;
    translations: SiteFooterTranslations;
};

export const SiteFooter: React.FC<SiteFooterProps> = ({ className, translations: t }) => {
    const email = userRepository.getContact(UserContactType.Email);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const x = userRepository.getContact(UserContactType.X);
    const github = userRepository.getContact(UserContactType.GitHub);
    const medium = userRepository.getContact(UserContactType.Medium);
    const pexels = userRepository.getContact(UserContactType.Pexels);

    const socialLinks = [
        { href: x.url.toString(), icon: IconBrandXFilled, label: 'X' },
        { href: linkedin.url.toString(), icon: IconBrandLinkedinFilled, label: 'LinkedIn' },
        { href: github.url.toString(), icon: IconBrandGithubFilled, label: 'GitHub' },
        { href: medium.url.toString(), icon: IconArticleFilled, label: 'Medium' },
        { href: pexels.url.toString(), icon: IconCameraFilled, label: 'Pexels' },
        { href: email.url.toString(), icon: IconMailFilled, label: 'Email' },
    ];

    const footerJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        alumniOf: {
            '@type': 'Organization',
            name: '42 Paris',
        },
        description:
            'AI Agent Developer and Fintech Engineer. Building intelligent systems that help humans grow—one commit at a time.',
        email: email.url.toString(),
        jobTitle: 'AI Agent Developer, Fintech Engineer',
        knowsAbout: [
            'AI Agent Development',
            'Fintech Engineering',
            'TypeScript',
            'Node.js',
            'Next.js',
            'React',
            'Solidity',
            'Personal Growth',
        ],
        name: 'Jean-Baptiste Terrazzoni',
        sameAs: [github.url.toString(), linkedin.url.toString(), x.url.toString()],
        url: 'https://jterrazz.com',
        worksFor: {
            '@type': 'Organization',
            name: 'Self-Employed',
        },
    };

    return (
        <footer
            className={cn(
                'w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950',
                className,
            )}
        >
            <Script id="footer-json-ld" strategy="afterInteractive" type="application/ld+json">
                {JSON.stringify(footerJsonLd)}
            </Script>

            <Container className="py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                            <Heading as="h2" size="title">
                                Jean-Baptiste Terrazzoni
                            </Heading>
                            <Lead size="sm">{t.tagline}</Lead>
                        </div>

                        <div className="flex items-center gap-3">
                            {socialLinks.map(({ href, icon: Icon, label }) => (
                                <a
                                    className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors"
                                    href={href}
                                    key={label}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    title={label}
                                >
                                    <Icon size={16} />
                                    <span className="sr-only">
                                        {label} {t.opensInNewTab}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {featuredApps.map(({ href, iconUrl, name }) => (
                            <a
                                className="group relative"
                                href={href}
                                key={name}
                                rel="noopener noreferrer"
                                target="_blank"
                                title={name}
                            >
                                <Image
                                    alt={name}
                                    className="rounded-lg shadow-[0_0_6px_rgba(0,0,0,0.04)] transition-transform group-hover:scale-105"
                                    height={40}
                                    src={iconUrl}
                                    width={40}
                                />
                                <span className="sr-only">
                                    {name} {t.opensInNewTab}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent mb-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Meta>© {new Date().getFullYear()} {t.allRightsReserved}</Meta>
                        <Meta className="hidden sm:inline">·</Meta>
                        <Meta className="hidden sm:inline">
                            Icons by{' '}
                            <a
                                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                href="https://tabler.io/icons"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Tabler
                            </a>
                        </Meta>
                    </div>
                    <ToggleTheme />
                </div>
            </Container>
        </footer>
    );
};
