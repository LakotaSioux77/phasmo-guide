import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      // Plain <script> tags (see index.html), not ES modules.
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Shared between script files at runtime: js/data/*.js set PD, js/engine.js sets PE.
        PD: "readonly",
        PE: "readonly",
        // js/engine.js checks for this with typeof before using it.
        module: "readonly",
      },
    },
  },
  {
    files: ["sw.js"],
    languageOptions: {
      sourceType: "script",
      globals: { ...globals.serviceworker },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
  },
];
