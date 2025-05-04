'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

import { cn } from '../lib/utils.js';

import { Alert } from '../components/ui/alert.jsx';

interface NotificationBannerProps {
    className?: string;
    href?: string;
    message: string;
}

export function NotificationBanner({ className, href, message }: NotificationBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<'auto' | number>('auto');

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.offsetHeight);
        }
    }, [isVisible]);

    const MessageComponent = href ? (
        <Link className="hover:text-white transition-colors" href={href}>
            {message}
        </Link>
    ) : (
        <span>{message}</span>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    animate={{
                        filter: 'blur(0px)',
                        height: height,
                        opacity: 1,
                        transition: {
                            filter: { duration: 0.15, ease: 'easeOut' },
                            height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.15, ease: 'easeOut' },
                        },
                    }}
                    className="overflow-hidden"
                    exit={{
                        filter: 'blur(8px)',
                        height: 0,
                        opacity: 0,
                        transition: {
                            filter: { duration: 0.1, ease: 'easeIn' },
                            height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.1, ease: 'easeIn' },
                        },
                    }}
                    initial={{ filter: 'blur(8px)', height: 0, opacity: 0 }}
                >
                    <div ref={contentRef}>
                        <Alert
                            className={cn(
                                'rounded-none border-0 bg-black text-white/90 px-4 py-1.5 text-center text-sm font-normal',
                                className,
                            )}
                        >
                            <div className="mx-auto max-w-screen-xl relative flex items-center justify-center">
                                <span className="px-8">{MessageComponent}</span>
                                <button
                                    aria-label="Close notification"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white hover:text-white/80 transition-colors"
                                    onClick={() => setIsVisible(false)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </Alert>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
