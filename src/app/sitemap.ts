import { createSitemap } from '@jterrazz/reach/next';

import { site } from '../../reach.config';
import {
    articlesProvider,
    experimentsProvider,
    mainPagesProvider,
} from '../infrastructure/seo/providers';

export default createSitemap(site, [mainPagesProvider, articlesProvider, experimentsProvider]);
