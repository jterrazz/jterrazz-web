import { audit } from '@jterrazz/manifest/testing';

import { site } from '../../../manifest.config';
import { website } from '../website.specification';

// The manifest audit — every declared surface, verified on the real site.
audit.website(website, site);
