---
title: Route parameters
label: Routing
---

As a User, I want to be able to view a detail page for an item by clicking on a "details" button, so that I can see more information about it.

### New Concepts

- **Route Parameters:** Dynamic segments in the URL used to pass data to routes.
- **`useRoute`:** A composition API function to access the current route object.
- **Shared State:** Extracting state into a separate file to be used across multiple components.

<details>
<summary>Hints</summary>

- [ ] Create a new file `views/DetailView.vue` and implement the template to display item details.
- [ ] In `router/index.js`, add the route `/item/:id` and map it to the `DetailView` component.
- [ ] Create `state.js` and move the `state` from `HomeView.vue` to `state.js`.
- [ ] Import `state` from `state.js` in both `HomeView.vue` and `DetailView.vue`.
- [ ] In `DetailView.vue`, display item details using the shared `state` and `useRoute` to get the item ID from the URL.
- [ ] Add a `<router-link>` to navigate to the detail view from the `ShoppingListItem` component.
</details>
