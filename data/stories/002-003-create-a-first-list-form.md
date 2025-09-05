---
title: Create a first list + form
label: Initial app
---

As a User, I want to be able to add an item to a list so that I can keep track of my shopping. The item name and quantity should be captured. After adding, the input should be empty and the quantity reset to 1. Each item should have a unique identifier.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-list.png?raw=true)

### New Concepts

- **`reactive`:** A function to create a reactive state object.
- **`v-for`:** A directive to render a list of items based on an array.
- **`v-bind:key`:** A directive to bind a unique key to each item in a list.
- **`v-model`:** A directive to create two-way data bindings on form input and textarea elements.
- **`crypto.randomUUID()`:** A function to generate a unique ID.

<details>
<summary>Hints</summary>

- [ ] Create a reactive state object to bind the `name` and `items` to.
- [ ] Use `v-for` to render the list items.
- [ ] Use `v-model` to bind the input fields to the reactive state.
- [ ] Create a function to handle the "add" button click.
- [ ] Use `crypto.randomUUID()` to generate a unique ID for each item.
</details>
