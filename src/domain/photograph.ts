export type Photograph = {
    contentUrl: string;
    index: number;
    metadata: {
        description: string;
        socials: {
            pexels?: string;
        };
    };
};
