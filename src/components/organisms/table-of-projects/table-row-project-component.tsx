import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlignLeft } from 'react-feather';

// Domain
import { type ProjectComponent } from '../../../domain/project.js';

import { DotPulse } from '../../atoms/status/dot-pulse.js';

import { projectComponentStatusToDoPulseState } from './table-row-project-component-view-model.js';
import { TableRowProjectDetails } from './table-row-project-details.js';

type TableRowProjectComponentProps = {
    className?: string;
    component: ProjectComponent;
};

export const TableRowProjectComponent: React.FC<TableRowProjectComponentProps> = ({
    className,
    component,
}) => {
    const [projectDetailIsVisible, setProjectDetailIsVisible] = React.useState(false);

    return (
        <div className={className} key={component.name}>
            <div
                className="flex items-center py-1 px-0 cursor-pointer text-storm-cloud text-storm-cloud-accent-hover"
                onClick={() => setProjectDetailIsVisible(!projectDetailIsVisible)}
            >
                <DotPulse color={projectComponentStatusToDoPulseState(component.status)} />
                <h4 className="text-sm ml-3">{component.name}</h4>
                {component.articleUrl && <AlignLeft className="ml-2" size={16} />}
            </div>

            <AnimatePresence>
                {projectDetailIsVisible && (
                    <motion.div
                        animate={{ marginTop: 0, opacity: 1, scale: 1 }}
                        exit={{ marginTop: -50, opacity: 0, scale: 0.7 }}
                        initial={{ marginTop: -50, opacity: 0, scale: 0.8 }}
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
