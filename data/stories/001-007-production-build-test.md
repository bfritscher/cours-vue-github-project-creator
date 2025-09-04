---
title: Production build test
label: Project Setup
---

As a developer, I want to create a production build of my application and test it, so that I can see the optimized version that will be deployed.

### New Concepts

- **npm run build:** Command to create a minified, production-ready build.
- **npm run preview:** Command to serve the production build locally.

### Checklist

- [ ] Create a built, minified version of your page with:
  ```sh
  npm run build
  ```
  Notice that you have a `dist` folder with this new content.
- [ ] Test the production version with:
  ```sh
  npm run preview
  ```
