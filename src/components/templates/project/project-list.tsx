import { Project, ProjectStatus } from '../../../domain/project/project.js';

import { Tag } from '../../atoms/tag.jsx';

export const ProjectList = (
    props: Readonly<{
        projects: ReadonlyArray<Project>;
    }>,
) => {
    const { projects } = props;

    return (
        <main
            className=""
            style={{
                maxWidth: 800,
            }}
        >
            <h1 className="font-medium text-4xl">Projects</h1>
            <p className="mt-3 w-2/3">
                A section displaying my code projects bla bla bla bla bla bla bla bla bla bla bla
                bla bla bla bla bla bla bla bla bla bla bla. I believe in making things that
                liberate people from power they can't control. That's why I will focus on two
                projects that empower people in the future (Self Improvement and Web3 + DeFi).
            </p>
            <ul className="flex flex-col mt-5">
                {projects.map((project) => (
                    <li key={project.name} className="flex flex-col border-gray-200 border-b">
                        <div className="flex flex-row items-center py-4">
                            <a href={project.name} className="flex-1">
                                <h2 className="font-medium mb-1">
                                    {project.name} ~ {project.createdAt.getFullYear()}
                                </h2>

                                {/*<p className="text-sm">{project.description}</p>*/}
                            </a>
                            <Tag
                                className="ml-2"
                                value={project.status}
                                state={
                                    project.status === ProjectStatus.Active ? 'active' : 'inactive'
                                }
                            />
                        </div>
                        {/*{project.components?.length && (*/}
                        {/*    <div className="text-xs">*/}
                        {/*        See {project.components?.length} components*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/*{project.components?.map((component) => (*/}
                        {/*    <div*/}
                        {/*        key={component.name}*/}
                        {/*        className="border-t border-slate-300 px-5 py-4"*/}
                        {/*    >*/}
                        {/*        <h3>{component.name}</h3>*/}
                        {/*        <p className="text-storm-cloud">{component.description}</p>*/}
                        {/*        <h5 className="font-bold">Technologies</h5>*/}
                        {/*        <ul className="flex">*/}
                        {/*            {component.technologies.map((technology) => (*/}
                        {/*                <li key={technology}>*/}
                        {/*                    <Tag value={technology} />*/}
                        {/*                </li>*/}
                        {/*            ))}*/}
                        {/*        </ul>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </li>
                ))}
            </ul>
        </main>
    );
};
