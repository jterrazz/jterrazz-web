import {
    type UserContact,
    type UserContactType,
    type UserExperience,
    type UserProfile,
    type UserRepository,
} from '../../domain/user.js';

import { userContactsData } from './data/user-contacts.data.js';
import { userExperiencesData } from './data/user-experiences.data.js';
import { userProfileData } from './data/user-profile.data.js';

export class UserInMemoryRepository implements UserRepository {
    private readonly userContactsData: Record<UserContactType, UserContact>;
    private readonly userExperiencesData: UserExperience[];
    private readonly userProfileData: UserProfile;

    constructor() {
        this.userProfileData = userProfileData;
        this.userContactsData = userContactsData;
        this.userExperiencesData = userExperiencesData;
    }

    getContact(contactType: UserContactType): UserContact {
        return this.userContactsData[contactType];
    }

    getContacts(): UserContact[] {
        return Object.values(this.userContactsData);
    }

    getExperiences(): UserExperience[] {
        return this.userExperiencesData;
    }

    getProfile(): UserProfile {
        return this.userProfileData;
    }
}
