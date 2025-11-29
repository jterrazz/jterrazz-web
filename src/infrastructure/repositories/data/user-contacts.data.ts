// Domain
import { type UserContact, UserContactType } from '../../../domain/user';

export const userContactsData: Record<UserContactType, UserContact> = {
    [UserContactType.Email]: {
        type: UserContactType.Email,
        url: new URL('mailto:jterrazzoni@gmail.com'),
        value: 'jterrazzoni@gmail.com',
    },
    [UserContactType.GitHub]: {
        type: UserContactType.GitHub,
        url: new URL('https://github.com/jterrazz'),
        value: 'jterrazz',
    },
    [UserContactType.LinkedIn]: {
        type: UserContactType.LinkedIn,
        url: new URL('https://www.linkedin.com/in/jterrazz'),
        value: 'jterrazz',
    },
    [UserContactType.Medium]: {
        type: UserContactType.Medium,
        url: new URL('https://medium.com/@jterrazz'),
        value: '@jterrazz',
    },
    [UserContactType.Phone]: {
        type: UserContactType.Phone,
        url: new URL('tel:+33600000000'),
        value: '+33 6 00 00 00 00',
    },
    [UserContactType.Twitter]: {
        type: UserContactType.Twitter,
        url: new URL('https://twitter.com/j_terrazz'),
        value: '@j_terrazz',
    },
    [UserContactType.Website]: {
        type: UserContactType.Website,
        url: new URL('https://jterrazz.com'),
        value: 'jterrazz.com',
    },
    [UserContactType.X]: {
        type: UserContactType.X,
        url: new URL('https://twitter.com/j_terrazz'),
        value: '@j_terrazz',
    },
};
