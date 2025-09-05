---
title: Create router
label: epic-4-routing
---

As a developer, I want to add routing to my application so that I can create multiple pages and navigate between them.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-router.png?raw=true)

### New Concepts

- **Vue Router:** The official router for Vue.js. https://router.vuejs.org/guide/
- **`<RouterLink>`:** The component for creating navigation links.
- **`<RouterView>`:** The component that renders the matched component for the current route.

### Acceptance Criteria

- [ ] The application is structured as a multi-page application using Vue Router.
- [ ] There are at least two pages: a "Home" page for the shopping list and an "About" page.
- [ ] Users can navigate between these pages using links at the top.

<details>
<summary>Hints</summary>

- [ ] Install Vue Router:
  ```sh
  npm install vue-router@4
  ```
- [ ] Move the current `App.vue` content to `views/HomeView.vue`.
- [ ] Create a new `App.vue` with this template:
  ```html
  <nav>
    <RouterLink to="/">Liste</RouterLink> -
    <RouterLink to="/apropos">À propos</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
  ```
- [ ] Create a second page `views/AboutView.vue`:
  ```html
  <script setup></script>
  <template>
    <div>
      <h1>À propos</h1>
      <p>Informations sur l'application.</p>
    </div>
  </template>
  ```
- [ ] Create the router configuration in `router/index.js`:

  ```js
  import { createRouter, createWebHashHistory } from "vue-router";

  import AboutView from "../views/AboutView.vue";
  import HomeView from "../views/HomeView.vue";

  const routes = [
    { path: "/", component: HomeView },
    { path: "/apropos", component: AboutView },
  ];

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
  });

  export default router;
  ```

- [ ] Connect the router to the app in `main.js`:

  ```js
  import { createApp } from "vue";

  import App from "./App.vue";
  import router from "./router";

  const app = createApp(App);
  app.use(router);
  app.mount("#app");
  ```

  </details>
