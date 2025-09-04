---
title: Eslint / Prettier config
label: Project Setup
---

As a developer, I want to configure ESLint and Prettier to enforce consistent code style and quality, so that the codebase is clean and readable.

### New Concepts

- **ESLint:** A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **Prettier:** An opinionated code formatter.

### Checklist

- [ ] **Update Prettier config:** Replace the content of `.prettierrc.json` with:
  ```json
  {
    "$schema": "https://json.schemastore.org/prettierrc",
    "semi": true,
    "tabWidth": 4,
    "singleQuote": false,
    "printWidth": 120,
    "trailingComma": "none"
  }
  ```
- [ ] **Update ESLint config:** In `eslint.config.js`, replace `'@vue/eslint-config-prettier/skip-formatting'` with `"@vue/eslint-config-prettier"` to make ESLint also run Prettier.
- [ ] **Run the linter:** Run `npm run lint` and check how the files are changed.
- [ ] **Test Linting:** Copy `let myvar = 'Hello World'` into `main.js` and observe the errors in the "PROBLEMS" tab of VS Code. You can right-click to fix the problem.

![](../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/lint-errors.png?raw=true)
