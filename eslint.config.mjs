import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: ["node_modules/", "dist/", "tests/Scenarios/"],
    },
    eslintPluginPrettier,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: { globals: globals.node },
        rules: {
            eqeqeq: "error",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-unused-vars": "off",
            "no-console": "error",
            "no-else-return": ["error", { allowElseIf: false }],
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    ignoreRestSiblings: true,
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/prefer-ts-expect-error": "error",
            "@typescript-eslint/no-explicit-any": ["error", { fixToUnknown: false, ignoreRestArgs: false }],
        },
    },
];
