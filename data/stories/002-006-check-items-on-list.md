---
title: Check items on the list
label: epic-2-core-features
---

As a User, I want to be able to check items on my shopping list so that I can mark them as completed. When an item is checked, it will appear in a second list at the bottom and be struck through.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-computed.png?raw=true)

### New Concepts

- **`computed`:** A function to create a computed property that automatically tracks its reactive dependencies.
- **text-decoration: line-through:** A CSS property to add a line through text.

### Acceptance Criteria

- [ ] Each shopping list item has a checkbox to mark it as "completed".
- [ ] When an item is checked, it is moved to a separate "Completed Items" list.
- [ ] Items in the "Completed Items" list are visually distinct (e.g., with a line-through).
- [ ] Unchecking an item in the "Completed Items" list moves it back to the main shopping list.
- [ ] The separation of items into two lists is managed by computed properties.

<details>
<summary>Hints</summary>

- [ ] Add a `checked` property to the item objects when they are created.
- [ ] Create a `computed` property to filter for incomplete items and another for completed items.
- [ ] Add a "check" button to each item that toggles its `checked` property.
- [ ] Add a CSS class for checked items (e.g., `text-decoration: line-through`).
- [ ] Use a `<label>` to make the full list item clickable to toggle the check.
</details>
