import { createLlms } from '@jterrazz/manifest/next';

import { site } from '../../../manifest.config';
import { articlesProvider, experimentsProvider } from '../../infrastructure/seo/providers';

// The index is fully derivable from the repositories at build time.
export const dynamic = 'force-static';

export const GET = createLlms(site, [articlesProvider, experimentsProvider]);
