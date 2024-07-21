import { PhotographInMemoryRepository } from '../../infrastructure/repositories/photograph-in-memory.repository.js';

import { PhotographsGridTemplate } from '../../components/templates/PhotographsGridTemplate.js';

export default async function PhotographsPage() {
    const photographsRepository = new PhotographInMemoryRepository();
    const photographs = await photographsRepository.getPhotographs();

    return <PhotographsGridTemplate photographs={photographs} />;
}
