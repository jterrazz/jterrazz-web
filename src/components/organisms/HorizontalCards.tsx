import React from 'react';

export type ResourceCardsProps = {
    children: React.ReactNode;
};

// TODO Move all margins
export const HorizontalCards: React.FC<ResourceCardsProps> = ({ children }) => {
    return (
        <div className="mb-16">
            <ul className="flex flex-row">{children}</ul>
        </div>
    );
};
