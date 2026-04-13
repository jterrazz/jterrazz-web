'use client';

import { useEffect } from 'react';

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Hide footer on mount
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }

        // Restore footer on unmount
        return () => {
            if (footer) {
                footer.style.display = '';
            }
        };
    }, []);

    return <>{children}</>;
}
