---
title: CSS Framework
label: epic-2-core-features
---

As a developer, I want to add a CSS framework to my project so that I can easily style my application with pre-built components.

### New Concepts

- **Bootstrap:** A popular CSS framework for building responsive, mobile-first sites.
- **Font Awesome:** A popular icon set and toolkit.

### Acceptance Criteria

- [ ] Bootstrap and Font Awesome are installed and integrated into the project.
- [ ] The application's styling is enhanced by Bootstrap's CSS.
- [ ] A test button styled with `btn btn-primary` is visible and functional.
- [ ] A Font Awesome icon (e.g., `fas fa-check`) is correctly displayed.

### Checklist

- [ ] Install Bootstrap and Font Awesome:
  ```sh
  npm install bootstrap @popperjs/core
  npm install @fortawesome/fontawesome-free
  ```
- [ ] In `src/main.js`, import the necessary CSS and JavaScript files:
  ```js
  import "bootstrap";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  ```
- [ ] Run your application with `npm run dev`
- [ ] Check that bootstrap works
  Add a button with the class `btn btn-primary` in your template of `src/App.vue` to test Bootstrap styles.
  ```html
  <button class="btn btn-primary">Test Bootstrap</button>
  ```
- [ ] Check that Font Awesome works
  Add an icon with the class `fas fa-check` in your template of `src/App.vue` to test Font Awesome styles.
  ```html
  <i class="fas fa-check"></i>
  ```

