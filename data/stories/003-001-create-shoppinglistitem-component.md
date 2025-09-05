---
title: Create a ShoppingListItem component
label: Components
---

As a Developer, I want to create a reusable component for each shopping list item so that I can remove duplication between both lists.

TODO component picks

### New Concepts

- **`defineProps`:** A macro to declare props a component can accept.
- **`defineEmits`:** A macro to declare the events a component can emit.
- **Props and Events:** The primary way for parent and child components to communicate.

<details>
<summary>Hints</summary>

It is best practice not to mutate the prop value in the child, so the `v-model` needs to be changed to `:checked` and `@input` with `$emit`. The parent will then handle the state change (e.g., `item.checked = !item.checked`).

- [ ] Create a new file `src/components/ShoppingListItem.vue`.
- [ ] Move the `<div>` element of the item and its logic and CSS into this new component.
- [ ] Use `defineProps` in the child to accept an `item` object.
- [ ] Use `defineEmits` in the child to declare a `toggle-checked` event.
- [ ] Use the CSS `checked` class conditionally only if `item.checked` is true.
- [ ] In the child's template, emit the event when the checkbox changes using `@input` and `$emit`.
- [ ] In `App.vue`, import the component and use it in the `v-for` loops, passing the `item` as a prop.
- [ ] In `App.vue`, listen for the emitted events (`@toggle-checked`) and call a method to update the item.
</details>
