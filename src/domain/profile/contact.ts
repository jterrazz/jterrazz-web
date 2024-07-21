export enum ContactType {
    Email = 'Email',
    GitHub = 'GitHub',
    LinkedIn = 'LinkedIn',
    Pexels = 'Pexels',
    X = 'X',
}

export interface Contact {
    url: URL;
    name: string;
}
