export type Photograph = {
    contentUrl: string;
    /*
     * Intrinsic size of the referenced variant. Without it the grid renders
     * zero-height images until they decode, which collapses the whole page
     * into the first viewport — every `loading="lazy"` image then counts as
     * visible and downloads at once, and the page jumps once they land.
     */
    height: number;
    index: number;
    metadata: {
        description: string;
        socials: {
            pexels?: string;
        };
    };
    width: number;
};
