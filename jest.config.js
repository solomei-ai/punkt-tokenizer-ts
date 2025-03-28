/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                module: 'node16',
                target: 'es2022',
            }
        }]
    },
    testMatch: [
        '**/src/**/__tests__/**/*.test.ts'
    ],
}