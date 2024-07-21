export type Photograph = {
    index: number;
    contentUrl: string;
    metadata: {
        description: string;
        socials: {
            pexels?: string;
        };
    };
};

export interface PhotographRepository {
    getPhotographByIndex(index: string): Photograph | undefined;
    getPhotographs(): Photograph[];
}
