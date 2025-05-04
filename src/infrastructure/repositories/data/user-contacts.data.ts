import { type UserContact, UserContactType } from '../../../domain/user.js';

export const userContactsData: Record<UserContactType, UserContact> = {
    [UserContactType.Email]: {
        name: 'Email',
        url: new URL('mailto:jterrazzoni@gmail.com'),
    },
    [UserContactType.GitHub]: {
        name: 'GitHub',
        url: new URL('https://github.com/jterrazz'),
    },
    [UserContactType.LinkedIn]: {
        name: 'LinkedIn',
        url: new URL('https://www.linkedin.com/in/jterrazz'),
    },
    [UserContactType.Medium]: {
        name: 'Medium',
        url: new URL('https://medium.com/@jterrazz'),
    },
    [UserContactType.Pexels]: {
        name: 'Pexels',
        url: new URL('https://www.pexels.com/@jterrazz'),
    },
    [UserContactType.X]: {
        name: 'X',
        url: new URL('https://twitter.com/j_terrazz'),
    },
};
