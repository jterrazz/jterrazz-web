export type Photograph = {
    index: number;
    imageUrl: string;
    metadata: PhotographMetadata;
};

export type PhotographMetadata = {
    description: string;
    socials: {
        pexels?: string;
    };
};
