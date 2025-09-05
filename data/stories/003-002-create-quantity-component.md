---
title: Create a quantity component
label: epic-3-components
---

As a Developer, I want to create a reusable component for the quantity input so that I can easily manage item quantities. I also want to reuse this component in the `ShoppingListItem` component to edit the quantity.

### New Concepts

- **`defineModel`:** A new macro in Vue 3.4+ that simplifies creating components that support `v-model`.

### Acceptance Criteria

- [ ] A new `QuantityInput.vue` component is created for managing quantity.
- [ ] This component can be used with `v-model` to bind to a quantity value.
- [ ] The `QuantityInput` component is used in the main form for adding new items.
- [ ] The `QuantityInput` component is also integrated into the `ShoppingListItem` component to allow editing of an item's quantity.
- [ ] When the quantity of an existing item is changed, an event is emitted to the parent to update the state, following the principle of props down, events up.

<details>
<summary>Hints</summary>

- [ ] Create a new file `src/components/QuantityInput.vue`.
- [ ] Define a `quantity` variable with `defineModel`.
- [ ] In `App.vue`, import the component and use it in the item template with `v-model`.
- [ ] Add the quantity input to the `ShoppingListItem` component as well.
- [ ] In the `ShoppingListItem` component, we cannot use the `QuantityInput` component with `v-model` to bind to `item.quantity` because children of a list should not directly modify their parent's state. Instead, use a prop to pass the quantity and an event to notify the parent of changes: `:modelValue="item.quantity" @update:modelValue="$emit('change', $event)"`.
- [ ] Add the `change` event to `defineEmits`.
- [ ] In `App.vue`, listen for the quantity `change` event and update the item's quantity.
</details>
