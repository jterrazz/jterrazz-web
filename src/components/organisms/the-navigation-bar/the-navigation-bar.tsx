'use client';

import React, { useState } from 'react';
import { Menu, X } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type UserContact } from '../../../domain/user.js';

import { cn } from '../../../lib/utils.js';

import AnimatedBackground from '../../molecules/cards/animated-backgrounds.jsx';

import { type NavigationPage } from './navigation-page.js';

export type NavigationTabItemProps = {
    className?: string;
    href: string;
    newTab?: boolean;
    onClick?: () => void;
    selected?: boolean;
    value: string;
};

export const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
    className = '',
    href,
    newTab = false,
    onClick,
    selected = false,
    value,
}) => {
    const baseClassName =
        'rounded-md px-3 py-2 text-sm w-full md:w-auto transition-colors duration-200 ease-in-out';
    const selectedClassName = selected
        ? 'bg-storm-cloud-accent text-white'
        : 'text-storm-cloud-accent hover:bg-storm-cloud-accent/10';
    const generatedClassName = cn(baseClassName, selectedClassName, className);

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
                    className="block w-full md:inline-block md:w-auto"
                    href={href}
                    onClick={onClick}
                >
                    {content}
                </Link>
            )}
        </div>
    );
};

export type NavigationTabsProps = {
    className?: string;
    onLinkClick?: () => void;
    pages: NavigationPage[];
};

const NavigationTabs: React.FC<NavigationTabsProps> = ({ className, onLinkClick, pages }) => {
    const newTab = false;
    const generatedClassName = cn(
        'flex flex-col md:flex-row justify-center items-center w-full',
        className,
    );
    const pathname = usePathname();

    return (
        <div className={generatedClassName}>
            <AnimatedBackground
                className="rounded-lg bg-zinc-200 dark:bg-zinc-600 p-2 md:p-1 flex flex-col md:flex-row items-center justify-center w-full md:w-auto"
                enableHover
                transition={{
                    bounce: 0.2,
                    duration: 0.3,
                    type: 'spring',
                }}
            >
                {pages.map((page, index) => {
                    const isSelected = pathname === page.href;
                    const baseClassName =
                        'rounded-md px-3 py-2 text-sm w-full md:w-auto transition-colors duration-200 ease-in-out text-center';
                    const selectedClassName = isSelected
                        ? 'bg-storm-cloud-accent text-white'
                        : 'text-storm-cloud-accent hover:bg-storm-cloud-accent/10';
                    const generatedClassName = cn(baseClassName, selectedClassName);

                    return (
                        <div
                            className="w-full md:w-auto mb-2 md:mb-0 md:mx-1"
                            data-id={page.name}
                            key={index}
                        >
                            {newTab ? (
                                <button
                                    className={generatedClassName}
                                    onClick={() => {
                                        window.open(page.href, '_blank');
                                        onLinkClick?.();
                                    }}
                                >
                                    {page.name}
                                </button>
                            ) : (
                                <Link
                                    className="block w-full md:inline-block md:w-auto"
                                    href={page.href}
                                    onClick={onLinkClick}
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
    contacts: UserContact[];
    pages: NavigationPage[];
};

export const TheNavigationBar: React.FC<TheNavigationBarProps> = ({
    className,
    contacts,
    pages,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const generatedClassName = cn(
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
                            animate={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -5 }}
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
                                alt="Jterrazz"
                                className="mr-3"
                                height={36}
                                src="/assets/icons/app-icon.jterrazz.png"
                                width={36}
                            />
                        </motion.div>
                    </Link>
                    <div className="hidden md:block">
                        <NavigationTabs onLinkClick={closeMenu} pages={pages} />
                    </div>
                </div>
                <div className="hidden md:flex items-center">
                    {contacts.map((contact, index) => (
                        <NavigationTabItem
                            className="ml-1 flex-shrink-0"
                            href={contact.url.toString()}
                            key={contact.name}
                            newTab={true}
                            onClick={closeMenu}
                            selected={index === 0}
                            value={contact.name}
                        />
                    ))}
                </div>
                <div className="md:hidden flex items-center">
                    {currentPage && (
                        <span className="mr-4 text-sm font-medium">{currentPage.name}</span>
                    )}
                    <button
                        aria-label="Toggle menu"
                        className="p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 180 }}
                                initial={{ opacity: 0, rotate: -180 }}
                                key={isMenuOpen ? 'close' : 'open'}
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
                        animate={{ height: 'auto', opacity: 1 }}
                        className="w-full md:hidden overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
                            exit={{ opacity: 0, y: -20 }}
                            initial={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <NavigationTabs onLinkClick={closeMenu} pages={pages} />
                        </motion.div>
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
                            exit={{ opacity: 0, y: -20 }}
                            initial={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >
                            <div className="flex flex-wrap mt-2">
                                {contacts.map((contact, _index) => (
                                    <NavigationTabItem
                                        className="mr-2 mb-2 flex-shrink-0"
                                        href={contact.url.toString()}
                                        key={contact.name}
                                        newTab={true}
                                        onClick={closeMenu}
                                        value={contact.name}
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
