import Script from 'next/script';

/**
 * Props for the JsonLdScript component
 */
export interface JsonLdScriptProps {
    /** JSON-LD structured data object */
    data: Record<string, unknown>;
    /** Unique identifier for the script tag */
    id: string;
}

/**
 * Renders JSON-LD structured data as a script tag
 * @description Encapsulates the Next.js Script component pattern for JSON-LD SEO data
 */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
    return (
        <Script id={id} strategy="beforeInteractive" type="application/ld+json">
            {JSON.stringify(data)}
        </Script>
    );
}
