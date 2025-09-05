---
title: Input validation and feedback
label: epic-2-core-features
---

As a User, I should not be able to click the "add" button if the input is empty or the quantity is less than 1. I should also be informed when the input is invalid so that I know what to correct. Finally, I should be informed with a message if the list is empty.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-if.png?raw=true)

### New Concepts

- **`v-bind:disabled`:** A directive to conditionally disable an element.
- **`v-if`:** A directive to conditionally render an element.


### Acceptance Criteria

- [ ] The "add" button is disabled if the item name input is empty.
- [ ] The "add" button is also disabled if the quantity is set to 0 or less.
- [ ] When the shopping list is empty, a message like "No items found" is shown to the user.
- [ ] These messages are only displayed when the corresponding conditions are met.

<details>
<summary>Hints</summary>

- [ ] Use `v-bind:disabled` to disable the button.
- [ ] Use `v-if` to conditionally render the "Invalid input" message with a Bootstrap alert.
- [ ] Use `v-if` to conditionally render the "No items found" message with a Bootstrap card.
</details>
