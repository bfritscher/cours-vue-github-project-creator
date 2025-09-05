---
title: Clear Completed Items
label: epic-3-components
---

As a User, I want a button to remove all completed items from my shopping list at once, so that I can quickly clear my list of items I've already purchased.

![](../../assets/vue-delete.png)

### Acceptance Criteria

- [ ] A "Clear Completed" button is visible on the page, but only when there is at least one completed item on the list.
- [ ] When the "Clear Completed" button is clicked, all items that have been marked as completed are removed from the list.
- [ ] If there are no completed items, the "Clear Completed" button is not be visible.

<details>
<summary>Hints</summary>

- Create a method to remove all completed items from your shopping list.
- Bind this method to a button in your `App.vue` template.
- Use a `v-if` directive on the button to conditionally render it. The condition should check if there are any completed items in your list. A computed property is a great way to handle this logic.

</details>
