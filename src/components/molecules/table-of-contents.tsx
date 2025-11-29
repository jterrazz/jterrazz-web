'use client';

import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

// Utils
import { cn } from '../../lib/utils';

import { slugify } from '../../lib/slugify';

type Heading = {
    id: string;
    level: number;
    title: string;
};

type TableOfContentsProps = {
    contentInMarkdown: string;
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({ contentInMarkdown }) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Parse headings from markdown
        // Matches # Title, ## Title or ### Title
        const matches = Array.from(contentInMarkdown.matchAll(/^(#{1,3})\s+(.+)$/gm));
        const parsedHeadings = matches.map((match) => {
            const rawTitle = match[2].trim();
            // Remove markdown syntax (bold, italic, code, links)
            const cleanTitle = rawTitle
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/__(.*?)__/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/_(.*?)_/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

            return {
                id: slugify(cleanTitle),
                level: match[1].length,
                title: cleanTitle,
            };
        });
        setHeadings(parsedHeadings);
    }, [contentInMarkdown]);

    useEffect(() => {
        if (headings.length === 0) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Show TOC after scrolling down a bit, hide if near bottom
            const isNearBottom = docHeight - scrollY - windowHeight < 400;
            setIsVisible(scrollY > 200 && !isNearBottom);

            // Find active heading
            const headingElements = headings.map((h) => document.getElementById(h.id));

            // Find the first heading that is visible or just passed
            // We look for the last heading that is above the center of the viewport
            let currentActiveId = '';
            const offset = 100; // Top offset

            for (const element of headingElements) {
                if (!element) continue;
                const rect = element.getBoundingClientRect();
                if (rect.top < offset + 100) {
                    currentActiveId = element.id;
                } else {
                    break;
                }
            }

            if (currentActiveId) {
                setActiveId(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check after a small delay to ensure DOM is ready
        setTimeout(handleScroll, 100);
        setTimeout(handleScroll, 500);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    if (headings.length === 0) return null;

    // Calculate minimum level to normalize indentation
    const minLevel = Math.min(...headings.map((h) => h.level));

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    animate={{ opacity: 0.6, x: 0 }}
                    className="hidden 2xl:block fixed left-[max(2rem,calc(50%-720px))] top-32 w-64 max-h-[calc(100vh-12rem)] overflow-y-auto p-4"
                    exit={{ opacity: 0, x: -20 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    whileHover={{ opacity: 1, x: 0 }}
                >
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 pl-4">
                        On this page
                    </h4>
                    <div className="relative">
                        {/* Continuous vertical line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

                        <ul className="space-y-0 relative">
                            <AnimatePresence initial={false}>
                                {headings.map((heading, index) => {
                                    const indentLevel = heading.level - minLevel;
                                    const isActive = activeId === heading.id;
                                    const isTopLevel = heading.level === minLevel;

                                    // Find the parent for this item
                                    let parentId = null;
                                    for (let i = index; i >= 0; i--) {
                                        if (headings[i].level < heading.level) {
                                            parentId = headings[i].id;
                                            break;
                                        }
                                    }

                                    // Find the active index from the headings array
                                    const activeIndex = headings.findIndex(
                                        (h) => h.id === activeId,
                                    );

                                    // Is any parent (direct or indirect) currently active?
                                    let isActiveOrAncestorActive = isActive;

                                    if (!isActiveOrAncestorActive) {
                                        // Check if the currently active item is a descendant of this item
                                        if (activeIndex !== -1) {
                                            let checkIndex = activeIndex;
                                            while (checkIndex >= 0) {
                                                const checkHeading = headings[checkIndex];
                                                if (
                                                    checkHeading.level < headings[activeIndex].level
                                                ) {
                                                    if (checkHeading.id === heading.id) {
                                                        isActiveOrAncestorActive = true;
                                                        break;
                                                    }
                                                }
                                                checkIndex--;
                                                if (checkIndex < index) break;
                                            }
                                        }
                                    }

                                    // Is the DIRECT parent of this item active?
                                    // Or is the DIRECT parent of this item an ancestor of the active item?
                                    let showBasedOnParent = false;
                                    if (isTopLevel) {
                                        showBasedOnParent = true;
                                    } else if (parentId) {
                                        const parentHeadingIndex = headings.findIndex(
                                            (h) => h.id === parentId,
                                        );

                                        if (parentHeadingIndex !== -1) {
                                            let isInsideParentScope = false;
                                            if (activeId === parentId) isInsideParentScope = true;
                                            else {
                                                if (activeIndex > parentHeadingIndex) {
                                                    let nextSiblingIndex = headings.length;
                                                    for (
                                                        let k = parentHeadingIndex + 1;
                                                        k < headings.length;
                                                        k++
                                                    ) {
                                                        if (
                                                            headings[k].level <=
                                                            headings[parentHeadingIndex].level
                                                        ) {
                                                            nextSiblingIndex = k;
                                                            break;
                                                        }
                                                    }

                                                    if (activeIndex < nextSiblingIndex) {
                                                        isInsideParentScope = true;
                                                    }
                                                }
                                            }

                                            if (isInsideParentScope) showBasedOnParent = true;
                                        }
                                    }

                                    if (!showBasedOnParent) return null;

                                    return (
                                        <motion.li
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                                transition: {
                                                    height: { duration: 0.3, ease: 'easeOut' },
                                                    opacity: { duration: 0.3, delay: 0.1 },
                                                },
                                            }}
                                            className="relative overflow-hidden"
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                                transition: {
                                                    height: { duration: 0.3, ease: 'easeIn' },
                                                    opacity: { duration: 0.2 },
                                                },
                                            }}
                                            initial={{ height: 0, opacity: 0 }}
                                            key={heading.id}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    animate={{ opacity: 1 }}
                                                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-900 dark:bg-zinc-100 z-10 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                                    exit={{ opacity: 0 }}
                                                    initial={{ opacity: 0 }}
                                                    layoutId="activeIndicator"
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 300,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            <a
                                                className={cn(
                                                    'block py-1.5 pr-4 text-sm transition-colors duration-200',
                                                    isActive
                                                        ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                                                        : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                                                )}
                                                href={`#${heading.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const element = document.getElementById(
                                                        heading.id,
                                                    );
                                                    if (element) {
                                                        window.scrollTo({
                                                            behavior: 'smooth',
                                                            top:
                                                                element.getBoundingClientRect()
                                                                    .top +
                                                                window.scrollY -
                                                                120,
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    paddingLeft: `calc(1rem + ${indentLevel * 0.75}rem)`,
                                                }}
                                            >
                                                {heading.title}
                                            </a>
                                        </motion.li>
                                    );
                                })}
                            </AnimatePresence>
                        </ul>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};
