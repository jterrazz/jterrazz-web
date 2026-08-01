import { defineContracts } from '@jterrazz/test';

import anchoredBlock from './http/anchored-block';

/**
 * The Bitcoin block source behind OTS verification (OTS_EXPLORER_URL — see
 * website.specification.ts). Height 956940 is where one of the OpenTimestamps
 * calendars anchored the article's proof; the response is frozen real Esplora
 * data so the OTS Merkle path this backs verifies against a block that will
 * never move.
 */
export default defineContracts(anchoredBlock);
