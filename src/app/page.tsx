import { Highlight } from '../components/molecules/highlight.jsx';

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between">
            <Highlight
                title="Highlights"
                description="I make products and build things with startups and organizations. I'm also a finance
                guy by formation and passion and spend a lot of time thinking about the intersection
                of finance, technology, and society. I believe in making things that liberate people
                from power they can't control. That's why I will focus on two projects that empower
                people in the future (Self Improvement and Web3 + DeFi). I'm also love photography
                and writing my ideas. I write about finance, technology, and society."
            />
            <div>Work</div>
            <div>Inde</div>
            <div>Bridge API</div>
            <div>Bankin</div>
            <div>42 school</div>
            <div>
                Dalia Delivery : First experience, mobile, website, api. Django, nestjs, startup, do
                a little of everything
            </div>
            <div>Accounting and finance formation / job</div>
        </main>
    );
}
