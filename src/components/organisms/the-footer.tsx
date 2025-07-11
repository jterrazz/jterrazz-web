'use client';

import React, { useRef } from 'react';
import { GitHub, Linkedin, Mail, Twitter } from 'react-feather';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { UserContactType } from '../../domain/user.js';

import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { cn } from '../../lib/utils.js';

import { HighlightedText } from '../atoms/highlighted-text.js';

type TheFooterProps = {
    className?: string;
};

export const TheFooter: React.FC<TheFooterProps> = ({ className }) => {
    const applications = [
        {
            description: 'Web Portfolio',
            href: 'https://jterrazz.com',
            imageSrc: '/assets/icons/app-icon.jterrazz.png',
            title: 'Jterrazz',
        },
        {
            description: 'Mobile App',
            href: 'https://jterrazz.com/link/applications/fake-news',
            imageSrc: '/assets/icons/app-icon.fake-news.jpg', // TODO Use repository
            title: 'Fake News',
        },
    ];

    const Application = ({
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
        <article className="flex items-center">
            <div className="rounded-2xl border border-black-and-white bg-white overflow-hidden">
                <Link
                    aria-label={`Visit ${title} - ${description}`}
                    className="text-sm"
                    href={href}
                >
                    <Image
                        alt={`${title} app icon`}
                        height="76"
                        loading="lazy"
                        src={imageSrc}
                        width="76"
                    />
                </Link>
            </div>
            <div className="ml-3">
                <Link
                    aria-label={`Visit ${title} - ${description}`}
                    className="text-sm"
                    href={href}
                >
                    <h3 className="text-sm font-extrabold tracking-wide">{title}</h3>
                </Link>
                <Link
                    aria-label={`Visit ${title} - ${description}`}
                    className="text-sm"
                    href={href}
                >
                    <p className="text-xs">{description}</p>
                </Link>
            </div>
        </article>
    );

    const generatedClassName = cn(
        'relative flex flex-col items-center justify-center py-12 text-storm-cloud-accent pb-[300px] sm:pb-[450px] md:pb-[600px]',
        className,
    );

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        offset: ['start end', 'end start'],
        target: ref,
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const FloatingContainer = ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => {
        const generatedClassName = cn(
            'border border-black-and-white bg-white/70 backdrop-blur-sm p-12 py-6 rounded-3xl',
            className,
        );
        return (
            <motion.div className="z-2" style={{ y }}>
                <div className={generatedClassName}>{children}</div>
            </motion.div>
        );
    };

    const userRepository = new UserInMemoryRepository();
    const email = userRepository.getContact(UserContactType.Email);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const x = userRepository.getContact(UserContactType.X);
    const github = userRepository.getContact(UserContactType.GitHub);

    // Structured data for footer
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
            aria-label="Site footer"
            className={generatedClassName}
            ref={ref}
            role="contentinfo"
        >
            <Script id="footer-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(footerJsonLd)}
            </Script>

            <div className="flex flex-col items-center -mb-40 md:-mb-60">
                <FloatingContainer className="flex flex-col items-center">
                    <h2 className="font-extrabold tracking-wide">Jean-Baptiste Terrazzoni</h2>
                    <p className="text-sm mt-2 tracking-wide">
                        On a mission to <HighlightedText>craft what matters.</HighlightedText>
                    </p>

                    <nav
                        aria-label="Social media links"
                        className="flex items-center space-x-4 justify-center mt-3"
                    >
                        <span className="text-xs font-medium">@jterrazz</span>
                        <a
                            aria-label="Send email to Jean-Baptiste Terrazzoni"
                            href={email.url.toString()}
                            rel="noopener noreferrer"
                            target="blank"
                        >
                            <Mail color="black" size="20" />
                        </a>
                        <a
                            aria-label="Visit Jean-Baptiste Terrazzoni on LinkedIn"
                            href={linkedin.url.toString()}
                            rel="noopener noreferrer"
                            target="blank"
                        >
                            <Linkedin color="black" size="20" />
                        </a>
                        <a
                            aria-label="Follow Jean-Baptiste Terrazzoni on X (Twitter)"
                            href={x.url.toString()}
                            rel="noopener noreferrer"
                            target="blank"
                        >
                            <Twitter color="black" size="20" />
                        </a>
                        <a
                            aria-label="View Jean-Baptiste Terrazzoni on GitHub"
                            href={github.url.toString()}
                            rel="noopener noreferrer"
                            target="blank"
                        >
                            <GitHub color="black" size="20" />
                        </a>
                    </nav>
                </FloatingContainer>

                <section aria-label="Featured applications" className="mt-6 w-full">
                    <FloatingContainer className="hidden md:flex md:space-x-12">
                        {applications.map((application, index) => (
                            <Application key={index} {...application} />
                        ))}
                    </FloatingContainer>
                </section>
            </div>

            {/* Full-width landscape image positioned at the very bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] sm:h-[450px] md:h-[600px] overflow-hidden -z-10">
                <Image
                    alt="Mountain landscape - Jean-Baptiste Terrazzoni's portfolio background"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    className="object-cover object-bottom"
                    fill
                    loading="lazy"
                    placeholder="blur"
                    sizes="100vw"
                    src="/assets/images/footer.jpg"
                />
            </div>

            <section
                aria-label="Mobile applications"
                className="flex flex-col space-y-6 md:hidden mt-12"
            >
                {applications.map((application, index) => (
                    <Application key={index} {...application} />
                ))}
            </section>

            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs md:text-sm text-white z-20 text-center pointer-events-none mb-8">
                © 2025 Jean-Baptiste Terrazzoni. All rights reserved.
            </p>
        </footer>
    );
};
