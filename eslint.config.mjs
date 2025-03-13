import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "warn", // Change from "error" to "warn"
      "@typescript-eslint/no-unused-vars": "warn", // If using TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off", // Suppress unescaped entities errors
      "@next/next/no-img-element": "warn", // Change error to warning
    },
  }
];

export default eslintConfig;
