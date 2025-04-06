'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Alert } from '@/components/ui/alert';

interface NotificationBannerProps {
    message: string;
    className?: string;
    href?: string;
}

export function NotificationBanner({ 
    message, 
    className,
    href 
}: NotificationBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const MessageComponent = href ? (
        <Link 
            href={href} 
            className="hover:text-white transition-colors"
        >
            {message}
        </Link>
    ) : (
        <span>{message}</span>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ damping: 20, stiffness: 260, type: 'spring' }}
            >
                <Alert
                    className={cn(
                        'rounded-none border-0 bg-black text-white/90 px-4 py-1.5 text-center text-sm font-normal',
                        className,
                    )}
                >
                    <div className="mx-auto max-w-screen-xl relative flex items-center justify-center">
                        <span className="px-8">{MessageComponent}</span>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white/90 transition-colors"
                            aria-label="Close notification"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </Alert>
            </motion.div>
        </AnimatePresence>
    );
}
