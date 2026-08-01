import { createSitemap } from '@jterrazz/manifest/next';

import { site } from '../../manifest.config';
import {
    articlesProvider,
    experimentsProvider,
    mainPagesProvider,
} from '../infrastructure/seo/providers';

export default createSitemap(site, [mainPagesProvider, articlesProvider, experimentsProvider]);
