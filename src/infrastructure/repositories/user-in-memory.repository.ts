// Domain
import {
    type UserContact,
    type UserContactType,
    type UserExperience,
    type UserProfile,
    type UserRepository,
} from '../../domain/user';

import { userContactsData } from './data/user-contacts.data';
import { userExperiencesData } from './data/user-experiences.data';
import { userProfileData } from './data/user-profile.data';

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
