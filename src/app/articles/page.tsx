import { Article, ArticlesListTemplate } from '../../components/templates/ArticlesListTemplate.js';

export default function ArticlesPage() {
    const articles: Article[] = [
        {
            id: '1',

            title: 'Hello, World!',
            // url: 'https://jeanbaptisteterrazzoni.com/hello-world',
            year: '2024',
        },
        {
            id: '2',

            title: 'Finance, Technology, and Society',
            // url: 'https://jeanbaptisteterrazzoni.com/finance-technology-society',
            year: '2024',
        },
    ];

    return <ArticlesListTemplate articles={articles} />;
}

// I am a writer with a focus on blockchain, decentralization, and development. My articles, published on the online platform Medium, delve into these topics and provide insights and analysis for a digital audience. Through my writing, I aim to educate and inform readers about the latest trends and developments in these exciting fields.
