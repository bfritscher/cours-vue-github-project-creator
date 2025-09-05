---
title: Delete Items by Quantity
label: epic-3-components
---

As a User, I want items to be automatically deleted from my shopping list when their quantity becomes less than 1, so that my list stays clean and up-to-date.

### Acceptance Criteria

- [ ] When a user decreases the quantity of an item to 0, the item is automatically removed from the shopping list.
- [ ] The change is reflected in the UI immediately.

<details>
<summary>Hints</summary>

- In `App.vue`, you'll need a `changeQuantity` method. This method should be triggered by a `change` event from the `ShoppingListItem` component.
- Inside the `changeQuantity` method, check if the new quantity for an item is less than 1.
- If the quantity is less than 1, remove the item from your list of shopping items. Vue's reactivity will automatically update the UI.

</details>
