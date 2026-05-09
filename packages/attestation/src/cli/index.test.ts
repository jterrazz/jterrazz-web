import { describe, expect, it, vi } from 'vitest';

import { runCli } from './index.js';

describe('CLI dispatcher', () => {
    it('prints help on no args', async () => {
        const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
        const exit = await runCli([]);
        expect(exit).toBe(0);
        const printed = stdout.mock.calls.map((c) => String(c[0])).join('');
        expect(printed).toContain('attestation');
        expect(printed).toContain('Usage:');
        stdout.mockRestore();
    });

    it('prints help on --help', async () => {
        const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
        const exit = await runCli(['--help']);
        expect(exit).toBe(0);
        stdout.mockRestore();
    });

    it('returns 2 for an unknown command', async () => {
        const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
        const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        const exit = await runCli(['nonsense']);
        expect(exit).toBe(2);
        stdout.mockRestore();
        stderr.mockRestore();
    });

    it('returns 1 for sign without required args', async () => {
        const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        const exit = await runCli(['sign']);
        expect(exit).toBe(1);
        const errOut = stderr.mock.calls.map((c) => String(c[0])).join('');
        expect(errOut).toMatch(/Missing required/);
        stderr.mockRestore();
    });
});
