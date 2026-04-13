import { describe, expect, test } from 'vitest';

import { ExperimentContext } from '../../domain/experiment';
import {
    ARTICLES_42_RELATED_INDICES,
    buildExperimentSeoDescription,
    buildExperimentSeoKeywords,
    buildSeoTitle,
    is42Experiment,
    is42RelatedArticle,
} from './seo-utils';

describe('buildSeoTitle', () => {
    test('should add "| 42 |" suffix for 42-related content', () => {
        // Given — a title for 42-related content
        const result = buildSeoTitle('Expert System', true);

        // Then — the title includes the 42 suffix
        expect(result).toBe('Expert System | 42 | Jean-Baptiste Terrazzoni');
    });

    test('should use standard suffix for non-42 content', () => {
        // Given — a title for non-42 content
        const result = buildSeoTitle('Capitaine', false);

        // Then — the title uses the standard suffix
        expect(result).toBe('Capitaine | Jean-Baptiste Terrazzoni');
    });

    test('should handle empty title', () => {
        // Given — an empty title string
        const result = buildSeoTitle('', true);

        // Then — the suffix is still appended
        expect(result).toBe(' | 42 | Jean-Baptiste Terrazzoni');
    });

    test('should handle title with special characters', () => {
        // Given — a title with special characters
        const result = buildSeoTitle('MD5 & SHA256', true);

        // Then — special characters are preserved
        expect(result).toBe('MD5 & SHA256 | 42 | Jean-Baptiste Terrazzoni');
    });
});

describe('buildExperimentSeoDescription', () => {
    test('should prepend "42 Paris school project: " for School42 context', () => {
        // Given — a description with School42 context
        const result = buildExperimentSeoDescription(
            'Backward chaining rule based system in Python.',
            ExperimentContext.School42,
        );

        // Then — the description is prefixed with 42 Paris school project
        expect(result).toBe(
            '42 Paris school project: Backward chaining rule based system in Python.',
        );
    });

    test('should return description unchanged for Personal context', () => {
        // Given — a description with Personal context
        const result = buildExperimentSeoDescription(
            'A day to day copilot for your life.',
            ExperimentContext.Personal,
        );

        // Then — the description is unchanged
        expect(result).toBe('A day to day copilot for your life.');
    });

    test('should return description unchanged for Professional context', () => {
        // Given — a description with Professional context
        const result = buildExperimentSeoDescription(
            'Enterprise application.',
            ExperimentContext.Professional,
        );

        // Then — the description is unchanged
        expect(result).toBe('Enterprise application.');
    });

    test('should return description unchanged for Hackathon context', () => {
        // Given — a description with Hackathon context
        const result = buildExperimentSeoDescription(
            'Hackathon project.',
            ExperimentContext.Hackathon,
        );

        // Then — the description is unchanged
        expect(result).toBe('Hackathon project.');
    });
});

describe('buildExperimentSeoKeywords', () => {
    test('should include 42-specific keywords for School42 context', () => {
        // Given — a School42 experiment
        const result = buildExperimentSeoKeywords(
            'Expert System',
            'Backward chaining rule based system in Python.',
            ExperimentContext.School42,
        );

        // Then — 42-specific keywords are included
        expect(result).toContain('42 expert system');
        expect(result).toContain('42 paris');
        expect(result).toContain('42 school project');
        expect(result).toContain('42 project');
        expect(result).toContain('expert system');
        expect(result).toContain('python');
    });

    test('should not include 42 keywords for Personal context', () => {
        // Given — a Personal experiment
        const result = buildExperimentSeoKeywords(
            'Capitaine',
            'A React Native application.',
            ExperimentContext.Personal,
        );

        // Then — no 42-specific keywords are present
        expect(result).not.toContain('42 capitaine');
        expect(result).not.toContain('42 paris');
        expect(result).not.toContain('42 school project');
        expect(result).toContain('capitaine');
    });

    test('should extract programming languages from description', () => {
        // Given — a description mentioning a programming language
        const result = buildExperimentSeoKeywords(
            'Malloc',
            'C implementation of the malloc library using mmap.',
            ExperimentContext.School42,
        );

        // Then — the language is extracted as a keyword
        expect(result).toContain('c');
    });

    test('should extract multiple programming languages', () => {
        // Given — a description mentioning multiple programming languages
        const result = buildExperimentSeoKeywords(
            'Test Project',
            'Built with Python and TypeScript for testing.',
            ExperimentContext.Personal,
        );

        // Then — all mentioned languages are extracted
        expect(result).toContain('python');
        expect(result).toContain('typescript');
    });

    test('should handle description without programming languages', () => {
        // Given — a description without any programming language mentions
        const result = buildExperimentSeoKeywords(
            'Simple App',
            'A simple application.',
            ExperimentContext.Personal,
        );

        // Then — only the project name is included as keyword
        expect(result).toContain('simple app');
        expect(result).not.toContain('python');
        expect(result).not.toContain('c');
    });
});

describe('is42Experiment', () => {
    test('should return true for School42 context', () => {
        // Given — a School42 context
        const context = ExperimentContext.School42;

        // Then — it is identified as a 42 experiment
        expect(is42Experiment(context)).toBe(true);
    });

    test('should return false for Personal context', () => {
        // Given — a Personal context
        const context = ExperimentContext.Personal;

        // Then — it is not identified as a 42 experiment
        expect(is42Experiment(context)).toBe(false);
    });

    test('should return false for Professional context', () => {
        // Given — a Professional context
        const context = ExperimentContext.Professional;

        // Then — it is not identified as a 42 experiment
        expect(is42Experiment(context)).toBe(false);
    });

    test('should return false for Hackathon context', () => {
        // Given — a Hackathon context
        const context = ExperimentContext.Hackathon;

        // Then — it is not identified as a 42 experiment
        expect(is42Experiment(context)).toBe(false);
    });
});

describe('is42RelatedArticle', () => {
    test('should return true for article index 1 (Malloc)', () => {
        // Given — article index 1
        const index = 1;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return true for article index 2 (SHA256)', () => {
        // Given — article index 2
        const index = 2;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return true for article index 3 (NM Otool)', () => {
        // Given — article index 3
        const index = 3;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return true for article index 4 (Quine)', () => {
        // Given — article index 4
        const index = 4;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return true for article index 5 (Assembly)', () => {
        // Given — article index 5
        const index = 5;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return true for article index 6 (Expert System)', () => {
        // Given — article index 6
        const index = 6;

        // Then — it is identified as 42-related
        expect(is42RelatedArticle(index)).toBe(true);
    });

    test('should return false for article index 7 (Koa - not 42 related)', () => {
        // Given — article index 7
        const index = 7;

        // Then — it is not identified as 42-related
        expect(is42RelatedArticle(index)).toBe(false);
    });

    test('should return false for article index 13 (Fake News)', () => {
        // Given — article index 13
        const index = 13;

        // Then — it is not identified as 42-related
        expect(is42RelatedArticle(index)).toBe(false);
    });

    test('should return false for article index 20 (AI Levels)', () => {
        // Given — article index 20
        const index = 20;

        // Then — it is not identified as 42-related
        expect(is42RelatedArticle(index)).toBe(false);
    });

    test('should return false for non-existent article index', () => {
        // Given — a non-existent article index
        const index = 999;

        // Then — it is not identified as 42-related
        expect(is42RelatedArticle(index)).toBe(false);
    });
});

describe('ARTICLES_42_RELATED_INDICES', () => {
    test('should contain exactly 6 article indices', () => {
        // Given — the constant of 42-related article indices
        const indices = ARTICLES_42_RELATED_INDICES;

        // Then — there are exactly 6 entries
        expect(indices).toHaveLength(6);
    });

    test('should contain indices 1-6', () => {
        // Given — the constant of 42-related article indices
        const indices = ARTICLES_42_RELATED_INDICES;

        // Then — it contains indices 1 through 6
        expect(indices).toEqual([1, 2, 3, 4, 5, 6]);
    });
});
