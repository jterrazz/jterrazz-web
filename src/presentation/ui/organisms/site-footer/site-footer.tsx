'use client';

import React from 'react';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Script from 'next/script';

// Domain
import { UserContactType } from '../../../../domain/user';

// Infrastructure
import { userRepository } from '../../../../infrastructure/repositories/user.repository';

// Utils
import { cn } from '../../../utils';

import { ToggleTheme } from '../../molecules/toggle-theme/toggle-theme';

type SiteFooterTranslations = {
    allRightsReserved: string;
    opensInNewTab: string;
    status: string;
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

    const socialLinks = [
        { href: email.url.toString(), icon: Mail, label: 'Email' },
        { href: linkedin.url.toString(), icon: Linkedin, label: 'LinkedIn' },
        { href: x.url.toString(), icon: Twitter, label: 'X' },
        { href: github.url.toString(), icon: Github, label: 'GitHub' },
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
            <Script id="footer-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(footerJsonLd)}
            </Script>

            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Top Section: Brand + Socials + Apps */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    {/* Brand */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Jean-Baptiste Terrazzoni
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.tagline}</p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-0.5">
                        {socialLinks.map(({ href, icon: Icon, label }) => (
                            <a
                                className="p-2 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                href={href}
                                key={label}
                                rel="noopener noreferrer"
                                target="_blank"
                                title={label}
                            >
                                <Icon size={18} />
                                <span className="sr-only">
                                    {label} {t.opensInNewTab}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

                {/* Bottom Section: Copyright + Theme + Status */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                        <span>
                            © {new Date().getFullYear()} {t.allRightsReserved}
                        </span>
                        <a
                            className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                            href="https://status.jterrazz.com"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {t.status}
                        </a>
                    </div>
                    <ToggleTheme />
                </div>
            </div>
        </footer>
    );
};
