export enum UserContactType {
    Email = 'email',
    GitHub = 'github',
    LinkedIn = 'linkedin',
    Medium = 'medium',
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
    company: string;
    companyUrl?: string;
    contract: 'cdi' | 'freelance' | 'internship';
    dateEnd?: Date;
    dateStart: Date;
    description: string;
    experimentUrl?: string;
    location: string;
    role: string;
    stack: string[];
};

export interface UserRepository {
    getContact(type: UserContactType): UserContact;
    getContacts(): UserContact[];
    getExperiences(): UserExperience[];
    getProfile(): UserProfile;
}

export type UserProfile = {
    description: string;
    headline: string;
    location: string;
    name: string;
    pictureUrl: string;
};
