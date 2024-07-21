'use client';

import React from 'react';
import Link from 'next/link';

import { HeadingSection } from '../atoms/typography/Heading.Section.js';
import { Highlight } from '../molecules/typography/Highlight.js';

export type Article = { title: string; year: string; id: string }; // TODO Domain

type BlogProps = {
    articles: Article[];
};

// TODO: Add package logger
// TODO Credit image from noun project

export const ArticlesListTemplate: React.FC<BlogProps> = ({ articles }) => {
    return (
        <main
            className="w-full flex flex-col self-center justify-self-center"
            style={{
                maxWidth: 740,
            }}
        >
            <Highlight
                className="my-20"
                title="Articles"
                description="Explore my articles....... ... lives. Check out my latest ventures in Self Improvement and Web3 + DeFi, aimed at giving you control and freedom in exciting new ways. Let’s build a brighter future together!"
            />

            <HeadingSection className="mb-6" title="Posts" />

            {/* Filters about Code / Finance & World */}
            <div className="flex justify-between mb-6">
                <button className="text-storm-cloud">Code</button>
                <button className="text-storm-cloud">Finance</button>
                <button className="text-storm-cloud">World</button>
            </div>

            {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                    <div className="flex items-center justify-between border-b border-black-and-white py-3">
                        <h3 className="font-bold">{article.title}</h3>
                        <p className="text-storm-cloud">WORLD ~ {article.year}</p>
                    </div>
                </Link>
            ))}
        </main>
    );
};
