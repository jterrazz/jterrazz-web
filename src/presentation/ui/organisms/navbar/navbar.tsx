'use client';

import { IconChevronDown, IconDownload, IconMenu2, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { defaultLocale, type Locale, locales } from '../../../../i18n/config';
// Infrastructure
import { Link } from '../../../../infrastructure/navigation/navigation';
import { useLocale } from '../../../context/locale-context';
// Utils
import { cn } from '../../../utils';
import { Container } from '../../design-system';
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
                className="flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {locale.toUpperCase()}
                <IconChevronDown
                    className={cn('transition-transform', isOpen && 'rotate-180')}
                    size={14}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full right-0 mt-2 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg min-w-20 z-50"
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                    >
                        {otherLocales.map((l) => (
                            <NextLink
                                className="block rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
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

type NavbarTranslations = {
    appStoreLink: string;
    downloadApp: string;
    getApp: string;
    hideAppButtonOnPaths: string[];
    homeHref: string;
    opensInNewTab: string;
};

type NavbarProps = {
    className?: string;
    pages: NavbarPage[];
    translations: NavbarTranslations;
};

export const Navbar: React.FC<NavbarProps> = ({ className, pages, translations: t }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMenuOpen(false);

    // Hide app button on specific paths (e.g., experiment pages with their own store links)
    const shouldShowAppButton = !t.hideAppButtonOnPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    return (
        <>
            <header
                className={cn(
                    'w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950',
                    className,
                )}
            >
                <Container width="shell">
                    <nav className="flex h-16 items-center justify-between gap-4">
                        {/* Desktop navigation — flush left */}
                        <div className="hidden md:flex items-center -ml-3.5">
                            {pages.map((page) => {
                                const isSelected = pathname === page.href;
                                return (
                                    <Link
                                        className={cn(
                                            'flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-150',
                                            isSelected
                                                ? 'text-zinc-950 dark:text-white'
                                                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white',
                                        )}
                                        href={page.href}
                                        key={page.href}
                                    >
                                        {page.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden md:flex items-center justify-end gap-1">
                            <div className="hidden lg:flex items-center gap-1">
                                <LanguageSwitcher />
                            </div>

                            <AnimatePresence initial={false} mode="wait">
                                {shouldShowAppButton && (
                                    <motion.a
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex h-9 w-9 items-center justify-center gap-2 lg:w-auto lg:px-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm whitespace-nowrap"
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        href={t.appStoreLink}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        rel="noreferrer"
                                        target="_blank"
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    >
                                        <span className="hidden lg:inline">{t.getApp}</span>
                                        <span className="sr-only"> {t.opensInNewTab}</span>
                                        <IconDownload size={16} />
                                    </motion.a>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile actions */}
                        <div className="md:hidden flex items-center gap-1">
                            <AnimatePresence initial={false} mode="wait">
                                {shouldShowAppButton && (
                                    <motion.a
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-center w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        href={t.appStoreLink}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        rel="noreferrer"
                                        target="_blank"
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    >
                                        <span className="sr-only">{t.getApp}</span>
                                        <IconDownload size={18} />
                                    </motion.a>
                                )}
                            </AnimatePresence>
                            <button
                                aria-label="Toggle menu"
                                className="flex items-center justify-center w-9 h-9 rounded-full text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                type="button"
                            >
                                {isMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
                            </button>
                        </div>
                    </nav>
                </Container>
            </header>

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
                            className="absolute top-6 right-6 p-2 text-black dark:text-white transition-colors"
                            onClick={closeMenu}
                            type="button"
                        >
                            <IconX size={24} />
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
                                        className="text-2xl font-semibold tracking-tight block text-black dark:text-white"
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
                            <LanguageSwitcher onSwitch={closeMenu} />

                            {shouldShowAppButton && (
                                <a
                                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium w-full justify-center"
                                    href={t.appStoreLink}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    <span>{t.downloadApp}</span>
                                    <span className="sr-only"> {t.opensInNewTab}</span>
                                    <IconDownload size={16} />
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
