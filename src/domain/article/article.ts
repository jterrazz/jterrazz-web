export type PostArticle = {
    title: string;
    year: number;
    content: string;
    // metadata: PostMetadata;
}; // TODO Only content

export type PostMetadata = { title: string; year: string };
