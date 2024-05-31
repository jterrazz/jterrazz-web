import { eslintNodeConfig } from '@jterrazz/package-typescript-quality';
import { jestEslint } from '@jterrazz/package-typescript-test';

export default [...eslintNodeConfig, ...jestEslint];
