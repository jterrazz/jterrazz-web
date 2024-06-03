import { getProjects } from '../../infrastructure/repositories/project.in-memory.repository.js';

import { ProjectList } from '../../components/templates/project/project-list.jsx';

export default function Project() {
    return <ProjectList projects={getProjects()} />;
}
