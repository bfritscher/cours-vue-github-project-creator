---
title: Route parameters
label: epic-4-routing
---

As a User, I want to be able to view a detail page for an item by clicking on a "details" button, so that I can see more information about it.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-router-param1.png?raw=true)

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-router-param2.png?raw=true)

### New Concepts

- **Route Parameters:** Dynamic segments in the URL used to pass data to routes.
- **`useRoute`:** A composition API function to access the current route object.
- **Shared State:** Extracting state into a separate file to be used across multiple components.


### Acceptance Criteria

- [ ] Users can navigate to a detailed view for each shopping list item.
    - [ ] The URL for the detail view includes a dynamic parameter for the item's ID (e.g., `/item/123`).
    - [ ] Navigation to the detail view is initiated by clicking a link or button on the main list.
- [ ] The application state is managed in a central location (`state.js`) and is accessible to multiple components.
- [ ] The detail view correctly retrieves and displays the information for the selected item based on the ID in the URL.



<details>
<summary>Hints</summary>

- [ ] Create a new file `views/DetailView.vue` and implement the template to display item details.
- [ ] In `router/index.js`, add the route `/item/:id` and map it to the `DetailView` component.
- [ ] Create `state.js` and move the `state` from `HomeView.vue` to `state.js`.
- [ ] Import `state` from `state.js` in both `HomeView.vue` and `DetailView.vue`.
- [ ] In `DetailView.vue`, display item details using the shared `state` and `useRoute` to get the item ID from the URL.
- [ ] Add a `<router-link>` to navigate to the detail view from the `ShoppingListItem` component.
</details>
