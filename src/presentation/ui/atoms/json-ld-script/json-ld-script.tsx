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
 * @description Emits a plain script tag so structured data is present in the
 * server-rendered HTML — crawlers must not need JavaScript to read it.
 * `<` is escaped to prevent breaking out of the script context.
 */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replaceAll('<', String.raw`\u003c`),
            }}
            id={id}
            type="application/ld+json"
        />
    );
}
