import { getProjects } from '../../infrastructure/repositories/project-in-memory.repository.js';

import { DotPulseState } from '../../components/atoms/status/DotPulse.jsx';
import { ApplicationsListTemplate } from '../../components/templates/ApplicationsListTemplate.js';

// TODO Rename to Apps ?

export default function ApplicationsPage() {
    const projects = getProjects();
    const resources = [
        {
            description: 'Code hosted on Github',
            state: DotPulseState.Success,
            title: 'Repository',
            url: 'https://github.com/jterrazz',
        },
        {
            description: 'This website code',
            state: DotPulseState.Success,
            title: 'Source',
            url: 'https://github.com/jterrazz/jterrazz-web',
        },
        {
            description: 'A life assistant',
            state: DotPulseState.Warning,
            title: 'Capitaine',
            url: 'https://capitaine.io', // TODO URL in interface
        },
    ];

    return <ApplicationsListTemplate projects={projects} resources={resources} />;
}
