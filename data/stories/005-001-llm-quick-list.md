---
title: LLM for quick list creation
label: epic-5-advanced
---

As a user, I want to be able to provide free text to add items to my list, so that I can quickly create a shopping list.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-ai.png?raw=true)

### New Concepts

- **Firebase:** A platform for building web and mobile applications.
- **Large Language Models (LLMs):** AI models that can understand and generate human-like text.


### Acceptance Criteria
- [ ] The application is connected to a Firebase project.
- [ ] There is a feature that allows users to input a shopping list as a single string of text (e.g., "2 apples, 1 milk, 3 bananas").
- [ ] This text is processed by a Large Language Model (LLM) to extract the individual items and quantities.
- [ ] The extracted items are then added to the shopping list.

### Checklist

- [ ] Create a Firebase project and a web app.
- [ ] Copy the Firebase config from the Firebase console to `src/services/firebase.js`.
- [ ] Install Firebase: `npm install firebase`.
- [ ] Copy the provided [`llmService.js`](https://github.com/bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/llmService.js) to `src/services/llmService.js`.
- [ ] Create a new button that uses the content from an input field as the LLM input.
- [ ] Use the `llmService.js` to process the text and populate the shopping list.


