---
title: Delete items
label: Components
---

As a User, I want to be able to remove items from my shopping list so that I can manage my list more effectively.

### User Stories

1. As a user, I want items to be automatically deleted when their quantity becomes less than 1.
2. As a user, I want a button to remove all completed items, and this button should only be visible if there are completed items.

<details>
<summary>Hints</summary>

- [ ] In `App.vue`, have a `changeQuantity` method that is triggered by the `change` event of the `ShoppingListItem` component.
- [ ] In `changeQuantity`, check if the quantity is less than 1 and remove the item from the list if it is.
- [ ] Create a method to remove all completed items and bind it to a button.
- [ ] Add a `v-if` directive to conditionally render the button only if there are completed items.
</details>
