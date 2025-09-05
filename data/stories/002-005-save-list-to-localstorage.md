---
title: Save the list with LocalStorage & JSON
label: Persistence
---

As a User, I want the shopping list to persist even after I close the browser or refresh the page, so that I can keep track of my items without losing them.

### New Concepts

- **`onMounted`:** A lifecycle hook that is called after the component has been mounted.
- **`watch`:** A function to perform a side effect in response to a reactive data change.
- **`localStorage`:** A web storage API to store key/value pairs locally.
- **`JSON.stringify()` & `JSON.parse()`:** Functions to convert JavaScript objects to and from JSON strings.

### Checklist

- [ ] Import `onMounted` and `watch` from `vue`.
- [ ] In the `onMounted` hook, read the `items` array from LocalStorage.
- [ ] Use `JSON.parse()` to convert the stored string back into a JavaScript array. Handle the case where nothing is stored yet.
- [ ] Create a `watch` hook that observes the reactive `state`.
- [ ] In the watcher's callback, write the current `items` array to LocalStorage using `JSON.stringify()`.
