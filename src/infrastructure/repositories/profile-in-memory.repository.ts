import { Contact, ContactType } from '../../domain/profile/contact.js';
import { ProfileRepository } from '../../domain/profile/profile.repository.js';

export class ProfileInMemoryRepository implements ProfileRepository {
    private contacts: Record<ContactType, Contact> = {
        [ContactType.Email]: {
            name: ContactType.Email,
            url: new URL('mailto:jterrazzoni@gmail.com'),
        },
        [ContactType.GitHub]: {
            name: ContactType.GitHub,
            url: new URL('https://github.com/jterrazz'),
        },
        [ContactType.LinkedIn]: {
            name: ContactType.LinkedIn,
            url: new URL('https://www.linkedin.com/in/jterrazz'),
        },
        [ContactType.X]: {
            name: ContactType.X,
            url: new URL('https://twitter.com/j_terrazz'),
        },
        [ContactType.Pexels]: {
            name: ContactType.Pexels,
            url: new URL('https://www.pexels.com/@jterrazz'),
        },
    };

    getOneContact(type: ContactType): Contact {
        return this.contacts[type];
    }

    getName(): string {
        return 'Jean-Baptiste Terrazzoni';
    }

    getAge(): string {
        return '27';
    }

    getTagline(): string {
        return 'Full-Stack Developer at Bridge by Bankin’ | Exploring the Intersection of Decentralization and FinTech with Open.MT';
    }
}
