import {
    UserContact,
    UserContactType,
    UserExperience,
    UserProfile,
    UserRepository,
} from '../../domain/user.js';

import { userContactsData } from '../data/user-contacts.data.js';
import { userExperiencesData } from '../data/user-experiences.data.js';
import { userProfileData } from '../data/user-profile.data.js';

export class UserInMemoryRepository implements UserRepository {
    private readonly userProfileData: UserProfile;
    private readonly userContactsData: Record<UserContactType, UserContact>;
    private readonly userExperiencesData: UserExperience[];

    constructor() {
        this.userProfileData = userProfileData;
        this.userContactsData = userContactsData;
        this.userExperiencesData = userExperiencesData;
    }

    getProfile(): UserProfile {
        return this.userProfileData;
    }

    getContacts(): UserContact[] {
        return Object.values(this.userContactsData);
    }

    getContact(contactType: UserContactType): UserContact {
        return this.userContactsData[contactType];
    }

    getExperiences(): UserExperience[] {
        return this.userExperiencesData;
    }
}
