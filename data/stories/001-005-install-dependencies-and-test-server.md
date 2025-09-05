---
title: Install dependencies and test server
label: epic-1-foundation
---

As a developer, I want to install the project dependencies and test the development server so that I can see my application running.

### New Concepts

- **npm install:** Command to install project dependencies from `package.json`.
- **npm run dev:** Command to start the development server with live reload.

### Checklist

- [ ] Inside your project folder, run:
  ```sh
  npm install
  ```
- [ ] Start the development server to test live reload:
  ```sh
  npm run dev
  ```
- [ ] Open the project folder in VS Code, edit a file (e.g., add `<h1>Test vue!</h1>` to `<body>` in `./index.html`), and watch the live reload in action.
- [ ] Stop the server with `ctrl+c`.
