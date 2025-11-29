'use client';

import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Download, Github, Menu, Monitor, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Utils
import { cn } from '../../../lib/utils';

import AnimatedBackground from '../../molecules/cards/animated-backgrounds';

import { type NavigationPage } from './navigation-page';

export type NavigationTabItemProps = {
    children: React.ReactNode;
    className?: string;
    href: string;
    newTab?: boolean;
    onClick?: () => void;
    title?: string;
};

const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
    children,
    className = '',
    href,
    newTab = false,
    onClick,
    title,
}) => {
    const content = <span className="flex items-center gap-2">{children}</span>;

    if (newTab) {
        return (
            <a
                className={className}
                href={href}
                onClick={onClick}
                rel="noopener noreferrer"
                target="_blank"
                title={title}
            >
                {content}
                <span className="sr-only"> (opens in a new tab)</span>
            </a>
        );
    }

    return (
        <Link className={className} href={href} onClick={onClick} title={title}>
            {content}
        </Link>
    );
};

type SerializableContact = {
    name: string;
    url: string;
};

type TheNavigationBarProps = {
    className?: string;
    contacts: SerializableContact[];
    pages: NavigationPage[];
};

export const TheNavigationBar: React.FC<TheNavigationBarProps> = ({
    className,
    contacts,
    pages,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMenuOpen(false);

    // Helper to get icon for contact
    const getContactIcon = (name: string) => {
        if (name.toLowerCase().includes('github')) return <Github size={18} />;
        if (name.toLowerCase().includes('medium')) return <BookOpen size={18} />;
        return null;
    };

    return (
        <>
            {/* Desktop & Mobile Wrapper */}
            {/* We use pointer-events-none on the wrapper so the transparent areas don't block clicks, 
                but re-enable it on the actual navbar content. */}
            <nav
                className={cn(
                    'w-full flex justify-center p-4 md:pt-6 pointer-events-none',
                    className,
                )}
            >
                <div
                    className={cn(
                        'pointer-events-auto relative flex items-center justify-between w-full md:w-auto md:min-w-[720px] lg:min-w-[800px]',
                        'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl',
                        'border border-zinc-200 dark:border-zinc-800 shadow-sm',
                        'rounded-2xl md:rounded-full pl-5 pr-2 py-2 transition-all duration-300',
                    )}
                >
                    {/* Logo */}
                    <Link className="flex-shrink-0 mr-6 md:mr-10" href="/" onClick={closeMenu}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Image
                                alt="Jterrazz"
                                className="rounded-full"
                                height={32}
                                src="/assets/icons/app-icon.jterrazz.png"
                                width={32}
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <AnimatedBackground
                            className="rounded-full bg-zinc-100 dark:bg-zinc-800"
                            enableHover
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.3,
                            }}
                        >
                            {pages.map((page) => {
                                const isSelected = pathname === page.href;
                                return (
                                    <div className="px-1" data-id={page.href} key={page.href}>
                                        <Link
                                            className={cn(
                                                'relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 block',
                                                isSelected
                                                    ? 'text-zinc-900 dark:text-zinc-100'
                                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200',
                                            )}
                                            href={page.href}
                                        >
                                            {page.name}
                                        </Link>
                                    </div>
                                );
                            })}
                        </AnimatedBackground>
                    </div>

                    {/* Desktop Contacts */}
                    <div className="hidden md:flex items-center gap-2 ml-4 md:ml-8">
                        {contacts.map((contact) => (
                            <NavigationTabItem
                                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors p-2"
                                href={contact.url}
                                key={contact.name}
                                newTab
                                title={contact.name}
                            >
                                {getContactIcon(contact.name) || (
                                    <span className="text-xs font-medium">{contact.name}</span>
                                )}
                            </NavigationTabItem>
                        ))}

                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-2" />

                        <a
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm hover:shadow-md"
                            href="/link/applications/fake-news"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <span>Get App</span>
                            <span className="sr-only"> (opens in a new tab)</span>
                            <Download size={14} />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center ml-auto">
                        <button
                            aria-label="Toggle menu"
                            className="p-2 text-zinc-600 dark:text-zinc-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed inset-0 z-[40] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col pt-32 px-8 md:hidden pointer-events-auto"
                        exit={{ opacity: 0, y: 20 }}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col gap-6">
                            {pages.map((page, index) => (
                                <motion.div
                                    animate={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    key={page.href}
                                    transition={{ delay: index * 0.05 + 0.1 }}
                                >
                                    <Link
                                        className={cn(
                                            'text-2xl font-semibold tracking-tight block',
                                            pathname === page.href
                                                ? 'text-zinc-900 dark:text-zinc-100'
                                                : 'text-zinc-500 dark:text-zinc-500',
                                        )}
                                        href={page.href}
                                        onClick={closeMenu}
                                    >
                                        {page.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            animate={{ opacity: 1 }}
                            className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6"
                            initial={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex gap-6">
                                {contacts.map((contact) => (
                                    <a
                                        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400"
                                        href={contact.url}
                                        key={contact.name}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {getContactIcon(contact.name) || <Monitor size={20} />}
                                        <span className="text-sm font-medium">{contact.name}</span>
                                        <span className="sr-only"> (opens in a new tab)</span>
                                    </a>
                                ))}
                            </div>

                            <a
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all w-full justify-center"
                                href="/link/applications/fake-news"
                                rel="noreferrer"
                                target="_blank"
                            >
                                <span>Download App</span>
                                <span className="sr-only"> (opens in a new tab)</span>
                                <Download size={16} />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
