import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".gh-ship-reports/**",
    ".sec-ship-reports/**",
    ".qatest-reports/**",
    ".playwright-mcp/**",
  ]),
  {
    // Two react-hooks rules shipped with Next 16 flag the legitimate
    // "sync React state with an external store" pattern (localStorage,
    // Supabase Realtime) as an anti-pattern. We deliberately use
    // setState-in-effect for those external-source hooks (claim-store,
    // use-page-sections) since the data isn't available until after
    // hydration (SSR has no localStorage). Demoting to warnings so they
    // surface in review without blocking CI on a known-correct pattern.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
]);

export default eslintConfig;
