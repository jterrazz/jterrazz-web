import { runCli } from './cli/index.js';

void runCli(process.argv.slice(2)).then((code) => process.exit(code));
