'use client';

import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, Download, Github, Menu, Monitor, X } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

// Infrastructure
import { Link } from '../../../../infrastructure/navigation/navigation';

// Utils
import { cn } from '../../../utils';

import { defaultLocale, type Locale, locales } from '../../../../i18n/config';
import { useLocale } from '../../../context/locale-context';
import { SelectionIndicator } from '../../atoms/selection-indicator/selection-indicator';

import { type NavbarPage } from './navbar-page';

/**
 * Build the path for a different locale
 */
function buildLocaleUrl(pathname: string, currentLocale: Locale, targetLocale: Locale): string {
    let basePath = pathname;
    if (currentLocale !== defaultLocale && pathname.startsWith(`/${currentLocale}`)) {
        basePath = pathname.slice(`/${currentLocale}`.length) || '/';
    }
    if (targetLocale === defaultLocale) {
        return basePath;
    }
    return `/${targetLocale}${basePath}`;
}

/**
 * Language switcher dropdown - shows current language with dropdown to select others
 */
function LanguageSwitcher({ className, onSwitch }: { className?: string; onSwitch?: () => void }) {
    const { locale } = useLocale();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const otherLocales = locales.filter((l) => l !== locale);

    return (
        <div className={cn('relative', className)} ref={dropdownRef}>
            <button
                className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {locale.toUpperCase()}
                <ChevronDown
                    className={cn('transition-transform', isOpen && 'rotate-180')}
                    size={12}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full right-0 mt-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg min-w-[80px] z-50"
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                    >
                        {otherLocales.map((l) => (
                            <NextLink
                                className="block px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                href={buildLocaleUrl(pathname, locale, l)}
                                hrefLang={l}
                                key={l}
                                onClick={() => {
                                    setIsOpen(false);
                                    onSwitch?.();
                                }}
                            >
                                {l.toUpperCase()}
                            </NextLink>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export type NavbarTabItemProps = {
    children: React.ReactNode;
    className?: string;
    href: string;
    newTab?: boolean;
    onClick?: () => void;
    title?: string;
};

const NavbarTabItem: React.FC<NavbarTabItemProps> = ({
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

type NavbarTranslations = {
    appStoreLink: string;
    downloadApp: string;
    getApp: string;
    homeHref: string;
    opensInNewTab: string;
};

type NavbarProps = {
    className?: string;
    contacts: SerializableContact[];
    pages: NavbarPage[];
    translations: NavbarTranslations;
};

export const Navbar: React.FC<NavbarProps> = ({ className, contacts, pages, translations: t }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMenuOpen(false);

    const getContactIcon = (name: string) => {
        if (name.toLowerCase().includes('github')) return <Github size={18} />;
        if (name.toLowerCase().includes('medium')) return <BookOpen size={18} />;
        return null;
    };

    return (
        <>
            <nav
                className={cn(
                    'w-full flex justify-center p-4 md:pt-6 pointer-events-none',
                    className,
                )}
            >
                <div
                    className={cn(
                        'pointer-events-auto relative',
                        'flex items-center justify-between w-full',
                        'md:w-auto md:min-w-[720px] lg:min-w-[900px]',
                        'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl',
                        'border border-zinc-200 dark:border-zinc-800 shadow-sm',
                        'rounded-2xl md:rounded-full p-1.5 transition-all duration-300',
                    )}
                >
                    {/* Left Section: Navigation */}
                    <div className="flex items-center">
                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <SelectionIndicator
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
                                                    'relative px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 block',
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
                            </SelectionIndicator>
                        </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="hidden md:flex justify-end items-center gap-1 lg:gap-2">
                        <LanguageSwitcher className="px-1" />

                        <div className="hidden lg:block w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

                        <div className="hidden lg:flex items-center gap-1">
                            {contacts.map((contact) => (
                                <NavbarTabItem
                                    className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors p-2"
                                    href={contact.url}
                                    key={contact.name}
                                    newTab
                                    title={contact.name}
                                >
                                    {getContactIcon(contact.name) || (
                                        <span className="text-xs font-medium">{contact.name}</span>
                                    )}
                                </NavbarTabItem>
                            ))}
                        </div>

                        <a
                            className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm ml-1"
                            href={t.appStoreLink}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <span className="hidden lg:inline">{t.getApp}</span>
                            <span className="sr-only"> {t.opensInNewTab}</span>
                            <Download size={14} />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center pr-2">
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
                        className="fixed inset-0 z-[40] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col pt-20 px-8 md:hidden pointer-events-auto"
                        exit={{ opacity: 0, y: 20 }}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Close Button */}
                        <button
                            aria-label="Close menu"
                            className="absolute top-6 right-6 p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            onClick={closeMenu}
                            type="button"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col gap-6 mt-8">
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
                            className="mt-auto pb-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6"
                            initial={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-6">
                                {contacts.map((contact) => (
                                    <a
                                        className="text-zinc-400 dark:text-zinc-500"
                                        href={contact.url}
                                        key={contact.name}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {getContactIcon(contact.name) || <Monitor size={20} />}
                                    </a>
                                ))}
                                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                                <LanguageSwitcher onSwitch={closeMenu} />
                            </div>

                            <a
                                className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium w-full justify-center"
                                href={t.appStoreLink}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <span>{t.downloadApp}</span>
                                <span className="sr-only"> {t.opensInNewTab}</span>
                                <Download size={16} />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
