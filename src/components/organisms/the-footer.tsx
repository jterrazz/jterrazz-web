'use client';

import React, { useRef } from 'react';
import { GitHub, Linkedin, Mail, Twitter } from 'react-feather';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { UserContactType } from '../../domain/user.js';

import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { mergeClassName } from '../../lib/utils.js';

import { HighlightedText } from '../atoms/highlighted-text.js';

type TheFooterProps = {
    className?: string;
};

export const TheFooter: React.FC<TheFooterProps> = ({ className }) => {
    const applications = [
        {
            description: 'Web',
            href: 'https://jterrazz.com',
            imageSrc: '/assets/applications/jterrazz.png',
            title: 'Jterrazz',
        },
        {
            description: 'Mobile',
            href: 'https://capitaine.io',
            imageSrc: '/assets/applications/capitaine.svg',
            title: 'Capitaine',
        },
    ];

    const Application = ({
        href,
        imageSrc,
        title,
        description,
    }: {
        href: string;
        imageSrc: string;
        title: string;
        description: string;
    }) => (
        <div className="flex items-center">
            <div className="rounded-2xl border border-black-and-white bg-white overflow-hidden">
                <Link href={href} className="text-sm">
                    <Image src={imageSrc} alt="Jterrazz.com" width="76" height="76" />
                </Link>
            </div>
            <div className="ml-3">
                <Link href={href} className="text-sm">
                    <h5 className="text-sm font-extrabold tracking-wide">{title}</h5>
                </Link>
                <Link href={href} className="text-sm">
                    <div className="text-xs">{description}</div>
                </Link>
            </div>
        </div>
    );

    const generatedClassName = mergeClassName(
        'flex flex-col items-center justify-center py-12 text-storm-cloud-accent',
        className,
    );

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        offset: ['start end', 'end start'],
        target: ref,
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

    const FloatingContainer = ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => {
        const generatedClassName = mergeClassName(
            'border border-black-and-white bg-white/70 backdrop-blur-sm p-12 py-6 rounded-3xl',
            className,
        );
        return (
            <motion.div style={{ y }} className="z-2">
                <div className={generatedClassName}>{children}</div>
            </motion.div>
        );
    };

    const userRepository = new UserInMemoryRepository();
    const email = userRepository.getContact(UserContactType.Email);
    const linkedin = userRepository.getContact(UserContactType.LinkedIn);
    const x = userRepository.getContact(UserContactType.X);
    const github = userRepository.getContact(UserContactType.GitHub);

    return (
        <footer className={generatedClassName} ref={ref}>
            <div className="flex flex-col items-center -mb-80">
                <FloatingContainer className="flex flex-col items-center">
                    <p className="font-extrabold tracking-wide">Jean-Baptiste Terrazzoni</p>
                    <p className="text-sm mt-2 tracking-wide">
                        On a mission to <HighlightedText>craft what matters.</HighlightedText>
                    </p>

                    <div className="flex items-center space-x-4 justify-center mt-3">
                        <span className="text-xs font-medium">@jterrazz</span>
                        <a href={email.url.toString()} target="blank">
                            <Mail color="black" size="20" />
                        </a>
                        <a href={linkedin.url.toString()} target="blank">
                            <Linkedin color="black" size="20" />
                        </a>
                        <a href={x.url.toString()} target="blank">
                            <Twitter color="black" size="20" />
                        </a>
                        <a href={github.url.toString()} target="blank">
                            <GitHub color="black" size="20" />
                        </a>
                    </div>
                </FloatingContainer>
                <FloatingContainer className="flex space-x-12 mt-6">
                    {applications.map((application, index) => (
                        <Application key={index} {...application} />
                    ))}
                </FloatingContainer>
            </div>

            <img
                src="/assets/footer-photograph.jpg"
                alt="Florence landscape"
                className="z-1 rounded-3xl"
                style={{ width: 1200 }}
            />

            <p className="text-sm mt-12 text-storm-cloud">© 2024. All rights reserved.</p>
        </footer>
    );
};
