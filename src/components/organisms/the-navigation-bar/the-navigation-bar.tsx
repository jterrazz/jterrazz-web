'use client';

import React, { useState } from 'react';
import { Menu, X } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserContact } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

import AnimatedBackground from '../../molecules/cards/animated-backgrounds.jsx';

import { NavigationPage } from './navigation-page.js';

export type NavigationTabItemProps = {
    className?: string;
    value: string;
    href: string;
    newTab?: boolean;
    selected?: boolean;
    onClick?: () => void;
};

export const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
    className = '',
    value,
    href,
    newTab = false,
    selected = false,
    onClick,
}) => {
    const baseClassName =
        'rounded-md px-3 py-2 text-sm w-full md:w-auto transition-colors duration-200 ease-in-out';
    const selectedClassName = selected
        ? 'bg-storm-cloud-accent text-white'
        : 'text-storm-cloud-accent hover:bg-storm-cloud-accent/10';
    const generatedClassName = mergeClassName(baseClassName, selectedClassName, className);

    const handleClick = () => {
        if (newTab) {
            window.open(href, '_blank');
        }
        onClick?.();
    };

    const content = (
        <button className={generatedClassName} onClick={handleClick}>
            {value}
        </button>
    );

    return (
        <div className="w-full md:w-auto md:ml-1">
            {newTab ? (
                content
            ) : (
                <Link
                    href={href}
                    onClick={onClick}
                    className="block w-full md:inline-block md:w-auto"
                >
                    {content}
                </Link>
            )}
        </div>
    );
};

export type NavigationTabsProps = {
    pages: NavigationPage[];
    className?: string;
    onLinkClick?: () => void;
};

const NavigationTabs: React.FC<NavigationTabsProps> = ({ pages, className, onLinkClick }) => {
    const newTab = false;
    const generatedClassName = mergeClassName(
        'flex flex-col md:flex-row justify-center items-center w-full',
        className,
    );
    const pathname = usePathname();

    return (
        <div className={generatedClassName}>
            <AnimatedBackground
                className="rounded-lg bg-zinc-200 dark:bg-zinc-600 p-2 md:p-1 flex flex-col md:flex-row items-center justify-center w-full md:w-auto"
                transition={{
                    bounce: 0.2,
                    duration: 0.3,
                    type: 'spring',
                }}
                enableHover
            >
                {pages.map((page, index) => {
                    const isSelected = pathname === page.href;
                    const baseClassName =
                        'rounded-md px-3 py-2 text-sm w-full md:w-auto transition-colors duration-200 ease-in-out text-center';
                    const selectedClassName = isSelected
                        ? 'bg-storm-cloud-accent text-white'
                        : 'text-storm-cloud-accent hover:bg-storm-cloud-accent/10';
                    const generatedClassName = mergeClassName(baseClassName, selectedClassName);

                    return (
                        <div
                            key={index}
                            data-id={page.name}
                            className="w-full md:w-auto mb-2 md:mb-0 md:mx-1"
                        >
                            {newTab ? (
                                <button
                                    onClick={() => {
                                        window.open(page.href, '_blank');
                                        onLinkClick?.();
                                    }}
                                    className={generatedClassName}
                                >
                                    {page.name}
                                </button>
                            ) : (
                                <Link
                                    href={page.href}
                                    onClick={onLinkClick}
                                    className="block w-full md:inline-block md:w-auto"
                                >
                                    <button className={generatedClassName}>{page.name}</button>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </AnimatedBackground>
        </div>
    );
};

type TheNavigationBarProps = {
    className?: string;
    pages: NavigationPage[];
    contacts: UserContact[];
};

export const TheNavigationBar: React.FC<TheNavigationBarProps> = ({
    contacts,
    pages,
    className,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const generatedClassName = mergeClassName(
        'flex flex-wrap items-center font-medium px-5 py-4 w-full border-b sticky top-0 z-50 bg-white/90 backdrop-blur-xl',
        className,
    );

    const closeMenu = () => setIsMenuOpen(false);

    const currentPage = pages.find((page) => page.href === pathname);

    return (
        <nav className={generatedClassName}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <Link href="/" onClick={closeMenu}>
                        <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeOut',
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Image
                                src="/assets/appicon-jterrazz.png"
                                alt="Jterrazz"
                                width={36}
                                height={36}
                                className="mr-3"
                            />
                        </motion.div>
                    </Link>
                    <div className="hidden md:block">
                        <NavigationTabs pages={pages} onLinkClick={closeMenu} />
                    </div>
                </div>
                <div className="hidden md:flex items-center">
                    {contacts.map((contact, index) => (
                        <NavigationTabItem
                            key={contact.name}
                            value={contact.name}
                            href={contact.url.toString()}
                            newTab={true}
                            selected={index === 0}
                            className="ml-1 flex-shrink-0"
                            onClick={closeMenu}
                        />
                    ))}
                </div>
                <div className="md:hidden flex items-center">
                    {currentPage && (
                        <span className="mr-4 text-sm font-medium">{currentPage.name}</span>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        className="p-2"
                    >
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={isMenuOpen ? 'close' : 'open'}
                                initial={{ opacity: 0, rotate: -180 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="w-full md:hidden overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
                        >
                            <NavigationTabs pages={pages} onLinkClick={closeMenu} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
                        >
                            <div className="flex flex-wrap mt-2">
                                {contacts.map((contact, _index) => (
                                    <NavigationTabItem
                                        key={contact.name}
                                        value={contact.name}
                                        href={contact.url.toString()}
                                        newTab={true}
                                        className="mr-2 mb-2 flex-shrink-0"
                                        onClick={closeMenu}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
