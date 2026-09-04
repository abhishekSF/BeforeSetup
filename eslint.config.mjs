import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { sonarjs },
    rules: {
      complexity: ["error", { max: 22 }],
      "max-lines": [
        "error",
        { max: 499, skipBlankLines: false, skipComments: false },
      ],
      "sonarjs/cognitive-complexity": ["error", 22],
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-dead-store": "error",
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSAnyKeyword",
          message: "Do not use the any type.",
        },
        {
          selector: "TSUnknownKeyword",
          message: "Do not use the unknown type.",
        },
      ],
    },
  },
  {
    files: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**", "scripts/**"],
    rules: {
      complexity: "off",
      "max-lines": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-identical-functions": "off",
      "sonarjs/no-duplicate-string": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "reports/**",
    ".stryker-tmp/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
