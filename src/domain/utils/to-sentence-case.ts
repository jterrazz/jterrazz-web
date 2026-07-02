/**
 * Normalize Title Case overuse (a common AI/marketing tic) back to sentence
 * case while preserving acronyms, mixed-case proper nouns, and the first word
 * of each sentence.
 *
 * The function is conservative: it only rewrites strings whose ratio of
 * capitalized words is high enough that the input is unambiguously in Title
 * Case. Normal prose with one or two proper nouns is left untouched.
 *
 * Examples:
 *   "Your Next AI Skill Is Worldbuilding" -> "Your next AI skill is worldbuilding"
 *   "How To Use The API For HTTP Calls"   -> "How to use the API for HTTP calls"
 *   "The OpenAI Revolution"               -> "The OpenAI revolution"
 *   "Cursor: the compression of mechanical work" -> unchanged
 *   "AI is making us smarter"             -> unchanged
 *
 * TODO: upstream into `@jterrazz/intelligence` (`parseText` family) next time
 * that package is bumped; remove this local copy once consumed via the package.
 */

const DEFAULT_PRESERVED_TERMS = [
    // Single-letter pronoun (always capitalized in English)
    'I',
    // Common tech acronyms
    'AI',
    'API',
    'CLI',
    'MCP',
    'URL',
    'URI',
    'HTTP',
    'HTTPS',
    'JSON',
    'CSV',
    'SDK',
    'HTML',
    'CSS',
    'UI',
    'UX',
    'CRM',
    'SaaS',
    'AWS',
    'GCP',
    'IDE',
    'OS',
    'CPU',
    'GPU',
    'RAM',
    'IO',
    'IP',
    'TCP',
    'TLS',
    'SSL',
    'SSH',
    'FTP',
    'SQL',
    'NoSQL',
    'REST',
    'GraphQL',
    'YAML',
    'XML',
    'JWT',
    'OAuth',
    'SSO',
    'MFA',
    '2FA',
    'CI',
    'CD',
    'PR',
    'NPM',
    'GPT',
    'LLM',
    'ML',
    'NLP',
    'OCR',
    'AR',
    'VR',
    'IoT',
    'P2P',
    // Common tech proper nouns
    'OpenAI',
    'ChatGPT',
    'Anthropic',
    'Claude',
    'Google',
    'Gemini',
    'Grok',
    'GitHub',
    'GitLab',
    'Microsoft',
    'Apple',
    'Meta',
    'Netflix',
    'Amazon',
    'Vercel',
    'Netlify',
    'Slack',
    'Discord',
    'Notion',
    'Linear',
    'Figma',
    'Cursor',
    'Codex',
    'Operator',
    'TypeScript',
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'Next.js',
    'iPhone',
    'iPad',
    'iOS',
    'macOS',
];

export interface ToSentenceCaseOptions {
    /**
     * Extra terms whose exact casing should be preserved (e.g. brand names).
     * Appended to the default tech-oriented list unless `replacePreserved` is set.
     */
    preservedTerms?: string[];

    /** If true, `preservedTerms` replaces the default list rather than extending it. */
    replacePreserved?: boolean;

    /**
     * Minimum ratio of capitalized words required to classify the input as Title
     * Case. Below this, the input is returned unchanged. Default 0.6.
     */
    titleCaseThreshold?: number;

    /**
     * Minimum word count required to attempt detection. Short strings (titles
     * with 1–2 words, brand lockups) are always returned unchanged. Default 3.
     */
    minWords?: number;
}

const WORD_PATTERN = /(?<word>[A-Za-z0-9']+)/;
const ACRONYM_PATTERN = /^[A-Z0-9]{2,6}$/;
const HAS_LOWER_THEN_UPPER = /[a-z][A-Z]/;
const SENTENCE_END_PATTERN = /[.!?]/;

export function toSentenceCase(text: string, options: ToSentenceCaseOptions = {}): string {
    if (!text) {
        return text;
    }

    const baseTerms = options.replacePreserved ? [] : DEFAULT_PRESERVED_TERMS;
    const preservedMap = new Map<string, string>();
    for (const term of [...baseTerms, ...(options.preservedTerms ?? [])]) {
        preservedMap.set(term.toLowerCase(), term);
    }

    const threshold = options.titleCaseThreshold ?? 0.6;
    const minWords = options.minWords ?? 3;

    /*
     * Split, keeping separators as tokens. With a capture group every other
     * entry is a word; runs in between are non-word separators (spaces, punct).
     */
    const tokens = text.split(WORD_PATTERN);
    const wordTokens = tokens.filter((t) => WORD_PATTERN.test(t) && /[A-Za-z]/.test(t));

    if (wordTokens.length < minWords) {
        return text;
    }

    const capitalizedCount = wordTokens.filter((t) => /^[A-Z]/.test(t)).length;
    const ratio = capitalizedCount / wordTokens.length;
    if (ratio < threshold) {
        return text;
    }

    /*
     * If most words match the generic acronym shape, the input is probably
     * shouting (ALL CAPS) rather than Title-Cased with embedded acronyms. In
     * that case we ignore the generic acronym pattern and rely solely on the
     * explicit `preservedTerms` list, so "YOUR" gets lowercased while "AI"
     * (present in the list) is kept.
     */
    const acronymPatternCount = wordTokens.filter((t) => ACRONYM_PATTERN.test(t)).length;
    const looksLikeShouting = acronymPatternCount / wordTokens.length >= 0.5;

    let isFirstWord = true;
    let nextStartsSentence = false;

    return tokens
        .map((tok) => {
            if (!WORD_PATTERN.test(tok) || !/[A-Za-z]/.test(tok)) {
                if (SENTENCE_END_PATTERN.test(tok)) {
                    nextStartsSentence = true;
                }
                return tok;
            }

            const startsNewSentence = isFirstWord || nextStartsSentence;
            isFirstWord = false;
            nextStartsSentence = false;

            // 1. Preserved terms (case-insensitive lookup, returns canonical casing)
            const preserved = preservedMap.get(tok.toLowerCase());
            if (preserved) {
                return preserved;
            }

            // 2. Generic acronym pattern (2–6 chars, digits/uppercase only).
            //    Skipped when the input looks like shouting — see above.
            if (!looksLikeShouting && ACRONYM_PATTERN.test(tok)) {
                return tok;
            }

            // 3. Mixed case (camelCase, "iPhone", "ChatGPT") — preserve verbatim.
            //    We require an internal lower→upper transition; pure "Word" or
            //    "WORD" patterns fall through to the standard rules below.
            if (HAS_LOWER_THEN_UPPER.test(tok)) {
                return tok;
            }

            // 4. Start of a sentence — capitalize first letter, lowercase rest
            if (startsNewSentence) {
                return tok[0].toUpperCase() + tok.slice(1).toLowerCase();
            }

            // 5. Default — lowercase
            return tok.toLowerCase();
        })
        .join('');
}
