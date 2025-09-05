---
title: List Transitions
label: epic-3-components
---

As a User, I want to see smooth transitions when items are added or removed from my shopping list so that I have a better visual experience.

### New Concepts

- **`<TransitionGroup>`:** A component for applying transitions to a list of elements.

### Acceptance Criteria

- [ ] When items are added to or removed from the shopping list, they animate smoothly.
- [ ] The animations provide a clear visual cue that the list has been updated.

### Checklist

- [ ] Use the `<TransitionGroup name="list" tag="div">` in `App.vue`.
- [ ] Define enter and leave transitions in CSS for the list items.

```css
/* List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
```


