export enum UserContactType {
    Email = 'Email',
    GitHub = 'GitHub',
    LinkedIn = 'LinkedIn',
    Pexels = 'Pexels',
    X = 'X',
    Medium = 'Medium',
}

export type UserContact = {
    url: URL;
    name: string;
};

export type UserExperience = {
    timeframe: string;
    year: string;
    title: string;
    description?: string;
    type: 'Hackathon' | 'Job' | 'Internship' | 'School';
    location: string;
    projectUrl?: string;
    organization: string;
    organizationUrl: string;
};

export type UserValue = {
    title: string;
    description: string;
};

export type UserProfile = {
    tagline: string;
    name: string;
    age: string;
    values: UserValue[];
};

export type UserRepository = {
    getProfile(): UserProfile;
    getContacts(): UserContact[];
    getContact(contactType: UserContactType): UserContact;
    getExperiences(): UserExperience[];
};
