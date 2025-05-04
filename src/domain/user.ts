export enum UserContactType {
    Email = 'Email',
    GitHub = 'GitHub',
    LinkedIn = 'LinkedIn',
    Medium = 'Medium',
    Pexels = 'Pexels',
    X = 'X',
}

export type UserContact = {
    name: string;
    url: URL;
};

export type UserExperience = {
    description?: string;
    location: string;
    organization: string;
    organizationUrl: string;
    projectUrl?: string;
    timeframe: string;
    title: string;
    type: 'Hackathon' | 'Internship' | 'Job' | 'School';
    year: string;
};

export type UserProfile = {
    age: string;
    name: string;
    tagline: string;
    values: UserValue[];
};

export type UserRepository = {
    getContact(contactType: UserContactType): UserContact;
    getContacts(): UserContact[];
    getExperiences(): UserExperience[];
    getProfile(): UserProfile;
};

export type UserValue = {
    description: string;
    title: string;
};
