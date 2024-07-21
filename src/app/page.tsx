import React from 'react';

import { UserExperience, UserValue } from '../domain/user.js';

import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { HelloWorldTemplate } from '../components/templates/hello-world.template.js';

export default function HomePage() {
    const userRepository = new UserInMemoryRepository();
    const userExperiences: UserExperience[] = userRepository.getExperiences();
    const userValues: UserValue[] = userRepository.getProfile().values;
    const description =
        'I’m passionate about building meaningful products. With a love for finance and technology, I’m here to create, connect, and share ideas that make a difference.';

    return (
        <HelloWorldTemplate
            experiences={userExperiences}
            values={userValues}
            description={description}
        />
    );
}
