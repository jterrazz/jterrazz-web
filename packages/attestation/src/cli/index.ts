import { parseArgs } from 'node:util';

import { fmt } from './io.js';
import { runSign } from './sign.js';
import { runUpgrade } from './upgrade.js';
import { runVerify } from './verify.js';

const HELP = `${fmt.bold('attestation')} — sign articles with EIP-712 + Bitcoin (OpenTimestamps).

Usage:
  attestation sign <file> --title <t> --slug <s> [--published-at <iso>]
  attestation verify <url|file> [--skip-ots]
  attestation upgrade <ots-file> [<ots-file> …]

Run \`attestation <command> --help\` for command-specific options.
`;

export async function runCli(argv: string[]): Promise<number> {
    const [command, ...rest] = argv;

    if (command === undefined || command === '-h' || command === '--help' || command === 'help') {
        process.stdout.write(HELP);
        return 0;
    }

    try {
        if (command === 'sign') {
            return await dispatchSign(rest);
        }
        if (command === 'verify') {
            return await dispatchVerify(rest);
        }
        if (command === 'upgrade') {
            return await dispatchUpgrade(rest);
        }
        process.stderr.write(`Unknown command: ${command}\n${HELP}`);
        return 2;
    } catch (error) {
        process.stderr.write(`${fmt.fail('Error:')} ${(error as Error).message}\n`);
        return 1;
    }
}

async function dispatchSign(argv: string[]): Promise<number> {
    const { positionals, values } = parseArgs({
        allowPositionals: true,
        args: argv,
        options: {
            locale: { type: 'string' },
            'prior-attestation': { type: 'string' },
            'published-at': { type: 'string' },
            revision: { type: 'string' },
            'skip-audit': { type: 'boolean' },
            'skip-stamp': { type: 'boolean' },
            slug: { type: 'string' },
            title: { type: 'string' },
        },
    });

    const file = positionals[0];
    if (!file) {
        throw new Error('Missing required <file> argument.');
    }
    if (!values.title) {
        throw new Error('Missing required --title.');
    }
    if (!values.slug) {
        throw new Error('Missing required --slug.');
    }

    await runSign({
        file,
        locale: values.locale,
        priorAttestation: values['prior-attestation'] as `0x${string}` | undefined,
        publishedAt: values['published-at'],
        revision: values.revision ? Number(values.revision) : undefined,
        skipAudit: values['skip-audit'],
        skipStamp: values['skip-stamp'],
        slug: values.slug,
        title: values.title,
    });
    return 0;
}

async function dispatchVerify(argv: string[]): Promise<number> {
    const { positionals, values } = parseArgs({
        allowPositionals: true,
        args: argv,
        options: {
            'skip-ots': { type: 'boolean' },
        },
    });

    const target = positionals[0];
    if (!target) {
        throw new Error('Missing required <url|file> argument.');
    }

    const ok = await runVerify({ skipOts: values['skip-ots'], target });
    return ok ? 0 : 1;
}

async function dispatchUpgrade(argv: string[]): Promise<number> {
    const { positionals } = parseArgs({ allowPositionals: true, args: argv, options: {} });
    await runUpgrade({ files: positionals });
    return 0;
}
