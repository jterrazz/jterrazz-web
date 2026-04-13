export enum UserContactType {
    Email = 'email',
    GitHub = 'github',
    LinkedIn = 'linkedin',
    Medium = 'medium',
    Pexels = 'pexels',
    Phone = 'phone',
    Twitter = 'twitter',
    Website = 'website',
    X = 'x',
}

export type UserContact = {
    type: UserContactType;
    url: URL;
    value: string;
};

export type UserExperience = {
    description: string;
    experimentUrl?: string;
    location: string;
    organization: string;
    organizationUrl?: string;
    timeframe: string;
    title: string;
    type: 'Hackathon' | 'Internship' | 'Job' | 'School';
    year: string;
};

export type UserProfile = {
    headline: string;
    location: string;
    name: string;
    pictureUrl: string;
};
