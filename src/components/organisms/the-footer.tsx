'use client';

import React, { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

// Domain
import { UserContactType } from '../../domain/user';

// Infrastructure
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository';

// Utils
import { cn } from '../../lib/utils';

import { HighlightedText } from '../atoms/highlighted-text';

type TheFooterProps = {
    className?: string;
};

export const TheFooter: React.FC<TheFooterProps> = ({ className }) => {
    const applications = [
        {
            description: 'Gallery',
            href: 'https://jterrazz.com',
            imageSrc: '/assets/icons/app-icon.jterrazz.png',
            title: 'Jterrazz',
        },
        {
            description: 'Application',
            href: 'https://jterrazz.com/link/applications/fake-news',
            imageSrc: '/assets/icons/app-icon.fake-news.jpg',
            title: 'News',
        },
    ];

    const ApplicationCard = ({
        description,
        href,
        imageSrc,
        title,
    }: {
        description: string;
        href: string;
        imageSrc: string;
        title: string;
    }) => (
        <Link
            className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-200"
            href={href}
            target="_blank"
        >
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Image
                    alt={`${title} icon`}
                    className="object-cover"
                    fill
                    sizes="40px"
                    src={imageSrc}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {title}
                    </h3>
                    <ArrowUpRight
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 transition-all duration-200 -translate-x-2 group-hover:translate-x-0"
                        size={14}
                    />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{description}</p>
            </div>
        </Link>
    );

    const SocialLink = ({
        href,
        icon: Icon,
        label,
        username,
    }: {
        href: string;
        icon: React.ElementType;
        label: string;
        username: string;
    }) => (
        <a
            className="group flex items-center gap-3 p-2 -mx-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                <Icon size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
                    {label}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500">{username}</span>
            </div>
        </a>
    );

    const generatedClassName = cn(
        'relative flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden',
        className,
    );

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        offset: ['start end', 'end start'],
        target: ref,
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    const userRepository = new UserInMemoryRepository();
    const email = userRepository.getContact(UserContactType.Email);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const x = userRepository.getContact(UserContactType.X);
    const github = userRepository.getContact(UserContactType.GitHub);

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
        <footer aria-label="Site footer" className={generatedClassName} ref={ref}>
            <Script id="footer-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(footerJsonLd)}
            </Script>

            {/* Background Layer */}
            <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                {/* Abstract Gradient Blob 1 */}
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-zinc-200/50 dark:bg-zinc-800/30 blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-overlay animate-blob" />
                {/* Abstract Gradient Blob 2 */}
                <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-zinc-300/50 dark:bg-zinc-800/30 blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-overlay animate-blob animation-delay-2000" />
                {/* Abstract Gradient Blob 3 */}
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-zinc-200/50 dark:bg-zinc-800/30 blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-overlay animate-blob animation-delay-4000" />

                {/* Grid overlay for texture */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-zinc-950 dark:via-transparent dark:to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                <motion.div className="w-full max-w-4xl mx-auto mb-12" style={{ y }}>
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-[2.5rem] p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
                            {/* Brand Section */}
                            <div className="md:col-span-5 flex flex-col justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                                        Jean-Baptiste Terrazzoni
                                    </h2>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
                                        <HighlightedText>
                                            Building, learning, and sharing.
                                        </HighlightedText>
                                        <br />
                                        Exploring the frontiers of AI, architecture, and
                                        decentralization.
                                    </p>
                                </div>

                                <div className="hidden md:block">
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
                                        © {new Date().getFullYear()} All rights reserved.
                                    </p>
                                </div>
                            </div>

                            {/* Links Section */}
                            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                                {/* Socials */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                        Connect
                                    </span>
                                    <SocialLink
                                        href={email.url.toString()}
                                        icon={Mail}
                                        label="Email"
                                        username="contact@jterrazz.com"
                                    />
                                    <SocialLink
                                        href={linkedin.url.toString()}
                                        icon={Linkedin}
                                        label="LinkedIn"
                                        username="/in/jterrazz"
                                    />
                                    <SocialLink
                                        href={x.url.toString()}
                                        icon={Twitter}
                                        label="X (Twitter)"
                                        username="@jterrazz"
                                    />
                                    <SocialLink
                                        href={github.url.toString()}
                                        icon={Github}
                                        label="GitHub"
                                        username="@jterrazz"
                                    />
                                </div>

                                {/* Projects */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                        Featured Work
                                    </span>
                                    {applications.map((app) => (
                                        <ApplicationCard key={app.title} {...app} />
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Copyright */}
                            <div className="md:hidden col-span-1 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 font-medium">
                                    © {new Date().getFullYear()} Jean-Baptiste Terrazzoni. All
                                    rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};
