'use client';

import {
    IconArticleFilled,
    IconBrandGithubFilled,
    IconBrandLinkedinFilled,
    IconBrandXFilled,
    IconMailFilled,
} from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';

// Domain
import { UserContactType } from '../../../../domain/user';
// Infrastructure
import { Link } from '../../../../infrastructure/navigation/navigation';
import { userRepository } from '../../../../infrastructure/repositories/user.repository';
// Utils
import { cn } from '../../../utils';
import { JsonLdScript } from '../../atoms/json-ld-script/json-ld-script';
import { Container } from '../../design-system';
import { ToggleTheme } from '../../molecules/toggle-theme/toggle-theme';

type SiteFooterTranslations = {
    allRightsReserved: string;
    opensInNewTab: string;
    tagline: string;
};

type SiteFooterProps = {
    className?: string;
    translations: SiteFooterTranslations;
};

// Internal sections — locale-aware links.
const EXPLORE_LINKS = [
    { href: '/articles', label: 'Articles' },
    { href: '/experiments', label: 'Experiments' },
    { href: '/photographs', label: 'Photographs' },
];

// First-party apps — external / smart-redirect links.
const APP_LINKS = [
    { href: 'https://jterrazz.com', label: 'Jterrazz' },
    { href: '/go/signews', label: 'SigNews' },
];

export const SiteFooter: React.FC<SiteFooterProps> = ({ className, translations: t }) => {
    const profile = userRepository.getProfile();
    const email = userRepository.getContact(UserContactType.Email);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const x = userRepository.getContact(UserContactType.X);
    const github = userRepository.getContact(UserContactType.GitHub);
    const medium = userRepository.getContact(UserContactType.Medium);

    const connectLinks = [
        { href: x.url.toString(), icon: IconBrandXFilled, label: 'X' },
        { href: linkedin.url.toString(), icon: IconBrandLinkedinFilled, label: 'LinkedIn' },
        { href: github.url.toString(), icon: IconBrandGithubFilled, label: 'GitHub' },
        { href: medium.url.toString(), icon: IconArticleFilled, label: 'Medium' },
        { href: email.url.toString(), icon: IconMailFilled, label: 'Email' },
    ];

    const footerJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        alumniOf: { '@type': 'Organization', name: '42 Paris' },
        description:
            'Building autonomous systems, products from scratch, and sovereign software. Notes on AI, autonomy, and the systems beneath.',
        email: email.url.toString(),
        jobTitle: 'Founder & Software Engineer',
        name: 'Jean-Baptiste Terrazzoni',
        sameAs: [github.url.toString(), linkedin.url.toString(), x.url.toString()],
        url: 'https://jterrazz.com',
    };

    const headingClass = 'font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100';
    const linkClass =
        'text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white';

    return (
        <footer
            className={cn(
                'w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950',
                className,
            )}
        >
            <JsonLdScript data={footerJsonLd} id="footer-json-ld" />

            <Container width="shell">
                <div className="flex flex-col gap-10 pt-12 pb-8 md:pt-16 md:pb-10">
                    {/* Top: brand + link columns */}
                    <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                        <div className="flex max-w-xs flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    alt={profile.name}
                                    className="rounded-xl"
                                    height={36}
                                    src="/assets/icons/appicon-jterrazz.png"
                                    width={36}
                                />
                                <span className="font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                                    {profile.name}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.tagline}</p>
                        </div>

                        <div className="flex gap-12 sm:gap-16">
                            <div className="flex flex-col gap-3 shell-reading:hidden">
                                <span className={headingClass}>Explore</span>
                                {EXPLORE_LINKS.map(({ href, label }) => (
                                    <Link className={linkClass} href={href} key={href}>
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <span className={headingClass}>Apps</span>
                                {APP_LINKS.map(({ href, label }) => (
                                    <a
                                        className={linkClass}
                                        href={href}
                                        key={label}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <span className={headingClass}>Connect</span>
                                {connectLinks.map(({ href, icon: Icon, label }) => (
                                    <a
                                        className={cn(linkClass, 'flex items-center gap-2')}
                                        href={href}
                                        key={label}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Icon size={15} />
                                        {label}
                                        <span className="sr-only">{t.opensInNewTab}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: copyright + theme toggle */}
                    <div className="flex items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                            © {new Date().getFullYear()} {profile.name}. {t.allRightsReserved}
                        </span>
                        <ToggleTheme />
                    </div>
                </div>
            </Container>
        </footer>
    );
};
