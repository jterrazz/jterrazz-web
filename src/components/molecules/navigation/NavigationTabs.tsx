import React from 'react';

export type NavigationTabsProps = {
    children: React.ReactNode;
};

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ children }) => {
    return <ul className="flex flex-row">{children}</ul>;
};
