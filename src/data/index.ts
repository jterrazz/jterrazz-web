/**
 * Central data access layer (client-safe).
 *
 * All data is loaded synchronously at startup and cached.
 * Import from this module for clean dependency injection.
 *
 * Note: For articles data, import directly from '@/data/articles.data' in server components
 * since it uses node:fs for reading markdown files.
 *
 * @example
 * import { data } from '@/data';
 *
 * const experiment = data.experiments.getBySlug('malloc');
 * const profile = data.user.getProfile();
 */

import { experimentsDataAccess } from './experiments.data';
import { featuresDataAccess, FeatureId } from './features.data';
import { photographsDataAccess } from './photographs.data';
import { userDataAccess } from './user.data';

export const data = {
    experiments: experimentsDataAccess,
    features: featuresDataAccess,
    photographs: photographsDataAccess,
    user: userDataAccess,
};

// Re-export FeatureId for convenience
export { FeatureId };
