---
title: Check items on the list
label: Persistence
---

As a User, I want to be able to check items on my shopping list so that I can mark them as completed. When an item is checked, it will appear in a second list at the bottom and be struck through.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-computed.png?raw=true)

### New Concepts

- **`computed`:** A function to create a computed property that automatically tracks its reactive dependencies.

### Checklist

- [ ] Add a `checked` property to the item objects when they are created.
- [ ] Create a `computed` property to filter for incomplete items and another for completed items.
- [ ] Add a "check" button to each item that toggles its `checked` property.
- [ ] Add a CSS class for checked items (e.g., `text-decoration: line-through`).
- [ ] Use a `<label>` to make the full list item clickable to toggle the check.
