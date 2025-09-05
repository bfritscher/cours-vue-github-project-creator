---
title: CSS Framework
label: Initial app
---

As a developer, I want to add a CSS framework to my project so that I can easily style my application with pre-built components.

### New Concepts

- **Bootstrap:** A popular CSS framework for building responsive, mobile-first sites.
- **Font Awesome:** A popular icon set and toolkit.

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
