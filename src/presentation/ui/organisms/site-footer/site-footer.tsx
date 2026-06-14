'use client';

import {
    IconArticleFilled,
    IconBrandGithubFilled,
    IconBrandLinkedinFilled,
    IconBrandXFilled,
    IconMailFilled,
} from '@tabler/icons-react';
import Image from 'next/image';
import Script from 'next/script';
import React from 'react';

// Domain
import { UserContactType } from '../../../../domain/user';
// Infrastructure
import { Link } from '../../../../infrastructure/navigation/navigation';
import { userRepository } from '../../../../infrastructure/repositories/user.repository';
// Utils
import { cn } from '../../../utils';
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
    { href: '/go/signew', label: 'SigNews' },
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

    /*
     * Dark ink that reads on the illustration; the footer is intentionally
     * illustration-themed (not dark-mode switched), like the reference.
     */
    const headingClass = 'font-display text-sm font-bold text-slate-900 dark:text-zinc-100';
    const linkClass =
        'text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white';

    return (
        <footer
            className={cn(
                'relative isolate w-full overflow-hidden aspect-[2400/1023] min-h-[520px]',
                className,
            )}
        >
            <Script id="footer-json-ld" strategy="afterInteractive" type="application/ld+json">
                {JSON.stringify(footerJsonLd)}
            </Script>

            {/* Full illustration — shown uncropped on desktop via the matching aspect ratio */}
            <Image
                alt=""
                className="-z-20 object-cover object-center select-none"
                fill
                sizes="100vw"
                src="/assets/footer/rocket-landscape.jpg"
            />
            {/* Dark veil — turns the illustration into a night version so light text
                reads in dark mode (no effect in light mode) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 hidden bg-zinc-950/55 dark:block"
            />
            {/* Seam — melts the page background into the top of the illustration */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-10 bg-gradient-to-b from-white to-transparent md:h-14 dark:from-zinc-950"
            />
            {/* Legibility scrim (light mode) — lightens the upper sky so dark text reads */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-white/55 via-white/15 to-transparent dark:hidden"
            />

            <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 pt-24 pb-10 md:px-8 md:pt-36 md:pb-14">
                {/* Top: brand + link columns */}
                <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                    <div className="flex max-w-xs flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image
                                alt={profile.name}
                                className="rounded-xl shadow-sm"
                                height={40}
                                src="/assets/icons/appicon-jterrazz.png"
                                width={40}
                            />
                            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                                {profile.name}
                            </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-zinc-300">
                            {t.tagline}
                        </p>
                    </div>

                    <div className="flex gap-12 sm:gap-16">
                        <div className="flex flex-col gap-3">
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

                {/* Bottom: copyright + theme toggle, over the landscape */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-16">
                    <span className="font-mono text-xs font-medium text-slate-700 dark:text-zinc-300">
                        © {new Date().getFullYear()} {profile.name}. {t.allRightsReserved}
                    </span>
                    <ToggleTheme />
                </div>
            </div>
        </footer>
    );
};
