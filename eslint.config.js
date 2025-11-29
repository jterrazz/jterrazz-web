import { node } from '@jterrazz/quality';

export default [
    {
        ignores: ['.next/**', 'next-env.d.ts'],
    },
    ...node,
    {
        rules: {
            // Disable file extension requirement - Turbopack doesn't support .js extension aliasing
            'file-extension-in-import-ts/file-extension-in-import-ts': 'off',
            // Forbid .js/.ts/.jsx/.tsx extensions in imports (Turbopack compatibility)
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ImportDeclaration[source.value=/\\.(js|ts|jsx|tsx)$/]',
                    message:
                        'Do not use file extensions in imports. Turbopack does not support them.',
                },
                {
                    selector: 'ExportNamedDeclaration[source.value=/\\.(js|ts|jsx|tsx)$/]',
                    message:
                        'Do not use file extensions in exports. Turbopack does not support them.',
                },
                {
                    selector: 'ExportAllDeclaration[source.value=/\\.(js|ts|jsx|tsx)$/]',
                    message:
                        'Do not use file extensions in exports. Turbopack does not support them.',
                },
            ],
        },
    },
];
