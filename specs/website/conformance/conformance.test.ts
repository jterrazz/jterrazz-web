import { conformance } from '@jterrazz/reach/testing';

import { site } from '../../../reach.config';
import { website } from '../website.specification';

// The reach rule pack — every declared surface, verified on the real site.
conformance(website, site);
