import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { ProjectComponent } from '../../../domain/project/project.js';

import { DotPulse } from '../../atoms/status/DotPulse.jsx';

import { projectComponentStatusToDoPulseState } from './TableRow.ProjectComponent.ViewModel.js';
import { TableRowProjectDetails } from './TableRow.ProjectDetails.jsx';

type TableRowProjectComponentProps = {
    component: ProjectComponent;
};

export const TableRowProjectComponent: React.FC<TableRowProjectComponentProps> = ({
    component,
}) => {
    const [projectDetailIsVisible, setProjectDetailIsVisible] = React.useState(false);

    return (
        <div key={component.name}>
            <div
                className="flex items-center py-1 px-0 cursor-pointer text-storm-cloud text-storm-cloud-accent-hover"
                onClick={() => setProjectDetailIsVisible(!projectDetailIsVisible)}
            >
                <DotPulse state={projectComponentStatusToDoPulseState(component.status)} />
                <h4 className="text-sm ml-3">{component.name}</h4>
            </div>

            <AnimatePresence>
                {projectDetailIsVisible && (
                    <motion.div
                        initial={{ marginTop: -50, opacity: 0, scale: 0.8 }}
                        animate={{ marginTop: 0, opacity: 1, scale: 1 }}
                        exit={{ marginTop: -50, opacity: 0, scale: 0.7 }}
                        transition={{
                            ease: 'anticipate',
                            marginTop: { duration: 0.2 },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.2 },
                        }}
                    >
                        <TableRowProjectDetails component={component} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
