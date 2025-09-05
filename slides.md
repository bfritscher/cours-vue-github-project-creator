# Vue.js Core Concepts

A presentation to introduce fundamental Vue.js concepts for student assignments.

---

## Module 1: The Foundation

This module covers the essential tools and setup required for modern web development with Vue.js.

---

### 1.1: Development Environment Setup

Before writing code, every developer needs a standard set of tools.

- **Node.js & `npm`**: Node.js is a JavaScript runtime that lets you run JS outside a browser. `npm` is its package manager, used for installing project dependencies.

  ```sh
  # Check versions after installing
  node --version
  npm --version
  ```

- **Git**: The industry-standard version control system for tracking code changes and collaborating with others.

  ```sh
  # Check version after installing
  git --version
  ```

- **Visual Studio Code**: A popular, free code editor with excellent support for Vue.js development, especially with the right extensions.

---

### 1.2: VS Code Extensions for Vue

Extensions enhance your editor with better syntax highlighting, code completion, and error checking.

- **Vue - Official** (`Vue.volar`): The essential extension for Vue 3. It provides full language support for Vue's Single-File Components (`.vue` files).
- **ESLint** (`dbaeumer.vscode-eslint`): Integrates the ESLint linter to find and fix problems in your JavaScript code right in the editor.
- **Prettier - Code formatter** (`esbenp.prettier-vscode`): An opinionated code formatter that ensures your code has a consistent style.

---

### 1.3: Creating a New Vue Project

`create-vue` is the official command-line tool for starting a new Vue project. It's fast, flexible, and sets you up with a modern build system (Vite).

```sh
# This command starts an interactive setup guide
npm create vue@latest
```

You'll be prompted to name your project and choose optional features like TypeScript, ESLint, and Prettier. For your assignments, starting with ESLint and Prettier is recommended.

---

### 1.4: Version Control with Git

Once your project is created, you should immediately place it under version control.

- **`git init`**: Initializes a new Git repository in your project folder.
- **`git add`**: Stages files, preparing them to be saved.
- **`git commit`**: Saves the staged files as a snapshot (a "commit") in your project's history.

```sh
# Typical first commit sequence
git init
git add .
git commit -m "Initial project setup"
```

---

### 1.5: Project Dependencies & Dev Server

Your `package.json` file lists all project dependencies. Vite, the build tool, provides a development server with Hot Module Replacement (HMR) for a fast feedback loop.

- **`npm install`**: Reads `package.json` and installs all necessary libraries into the `node_modules` folder.
- **`npm run dev`**: Starts the local development server. Any changes you make to your source files will instantly appear in the browser.

---

### 1.6: Code Quality with ESLint & Prettier

- **ESLint**: A static analysis tool that finds problematic patterns or code that doesn't adhere to style guidelines. It helps prevent bugs.
- **Prettier**: An opinionated code formatter. It enforces a consistent code style (e.g., spacing, line breaks, quotes) across the entire project, eliminating arguments about style.

You can configure rules for both in `eslint.config.mjs` and `.prettierrc.json`.

---

### 1.7: Production Builds

When you're ready to deploy your site, you need to create an optimized "build".

- **`npm run build`**: This command uses Vite to compile, minify, and bundle your code into a small set of static files (HTML, CSS, JS) in a `dist/` directory. This version is what you host on a server.
- **`npm run preview`**: A helpful command to serve your `dist/` folder locally, so you can check the production version before deploying.

---

### 1.8: CI/CD with GitHub Actions

Continuous Integration/Continuous Deployment (CI/CD) automates the process of building and deploying your application.

- **GitHub Actions**: A platform that lets you run automated workflows directly from your GitHub repository.
- **Workflow File**: A YAML file (e.g., `.github/workflows/deploy.yml`) defines the steps to run, such as checking out code, installing dependencies, and running the build command, whenever you push changes.

---

## Module 2: Core Vue Concepts

This module introduces the reactive system, templates, and fundamental directives that make Vue powerful.

---

### 2.1: Adding a CSS Framework

Styling is a key part of any application. Frameworks like Bootstrap provide pre-built components and a responsive grid system to speed up development.

To add a framework, you typically install it via `npm` and then import its main CSS file into your project's entry point (`src/main.js`).

```js
// src/main.js
import { createApp } from "vue";

import App from "./App.vue";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App).mount("#app");
```

---

### 2.2: Reactivity with `ref`

Vue's core feature is its reactivity system. When you change your data, the user interface automatically updates.

- **`ref`**: A function used to create a reactive variable for a primitive value (like a string, number, or boolean).
- **`.value`**: To access or modify the value of a `ref`, you must use its `.value` property in your `<script>` block. Vue automatically "unwraps" it in the template, so you don't need `.value` there.

```vue
<script setup>
import { ref } from 'vue'

// Create a reactive number
const count = ref(0)

function increment() {
  // Access the value with .value in the script
  count.value++
}
</script>

<template>
  <!-- No .value needed in the template -->
  <p>Count: {{ count }}</p>
  <button @click="increment">Increment</button>
</template>
```

---

### 2.3: Reactivity with `reactive`

For complex data like objects and arrays, Vue provides the `reactive` function.

- **`reactive`**: Returns a reactive version of an object. Unlike `ref`, you don't use `.value` to access or modify its properties.
- **When to use `ref` vs. `reactive`?**
  - Use `ref` for individual primitive values.
  - Use `reactive` for grouping multiple related values in an object.

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Jane Doe',
  email: 'jane@example.com',
  isActive: true
})

function deactivateUser() {
  user.isActive = false
}
</script>

<template>
  <p>User: {{ user.name }}</p>
  <p>Status: {{ user.isActive ? 'Active' : 'Inactive' }}</p>
</template>
```

---

### 2.4: Two-Way Binding with `v-model`

`v-model` creates a two-way binding between a form input and a reactive variable. It's a shortcut that simplifies handling user input.

- When the user types in the input, the `message` ref is updated.
- If the `message` ref is changed in the script, the input field's value updates.

```vue
<script setup>
import { ref } from 'vue'

const message = ref('')
</script>

<template>
  <!-- v-model syncs the input with the 'message' ref -->
  <input v-model="message" placeholder="Type something..." />
  <p>You are typing: {{ message }}</p>
</template>
```

---

### 2.5: Rendering Lists with `v-for`

The `v-for` directive is used to render a list of items based on an array.

- **Syntax**: `item in items`, where `items` is the source array and `item` is an alias for the element being rendered.
- **`:key`**: It's crucial to provide a unique `key` for each item. This allows Vue to track each item's identity, making list updates much more efficient. Use a unique ID from your data, not the array index.

```vue
<script setup>
import { reactive } from 'vue'

const items = reactive([
  { id: 'a1', name: 'First Item' },
  { id: 'b2', name: 'Second Item' },
  { id: 'c3', name: 'Third Item' }
])
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

---

### 2.6: Conditional Rendering with `v-if`

The `v-if`, `v-else-if`, and `v-else` directives allow you to conditionally render blocks of HTML.

- **`v-if`**: The block is only rendered if the expression is truthy.
- **`v-else-if` / `v-else`**: Must follow a `v-if` or `v-else-if` block.
- **`v-show`**: An alternative that always renders the element but toggles its CSS `display` property. Use `v-show` if you need to toggle something frequently, and `v-if` for conditions that rarely change.

```vue
<script setup>
import { ref } from 'vue'
const score = ref(85)
</script>

<template>
  <div v-if="score >= 90">Grade: A</div>
  <div v-else-if="score >= 80">Grade: B</div>
  <div v-else>Grade: C or lower</div>
</template>
```

---

### 2.7: Computed Properties

`computed` properties let you create a new reactive value that is derived from other reactive data. They are cached and only re-evaluate when their dependencies change.

Use computed properties for any logic in your template. This keeps your templates clean and your calculations efficient.

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Jane')
const lastName = ref('Doe')

// A computed property that combines first and last name
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
</script>

<template>
  <p>Full Name: {{ fullName }}</p>
</template>
```

---

### 2.8: Watching for Changes with `watch`

A `watch` function lets you perform a "side effect" in response to a data change. Side effects are operations that affect something outside of the component, like calling an API, or writing to `localStorage`.

- **First argument**: The reactive source to watch (`ref` or `reactive` object).
- **Second argument**: The callback function to run when the source changes.

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')

// This watcher runs whenever the 'question' ref changes
watch(question, (newQuestion, oldQuestion) => {
  console.log(`The question changed from "${oldQuestion}" to "${newQuestion}"`)
  // You could call an API here, for example.
})
</script>

<template>
  <input v-model="question" placeholder="Ask a question" />
</template>
```

---

### 2.9: Persisting State with `localStorage`

`localStorage` is a browser API that lets you save key-value pairs that persist even after the browser is closed. It's perfect for saving application state.

- **`onMounted`**: A lifecycle hook that runs after the component is first rendered. It's the ideal place to load data from `localStorage`.
- **`watch`**: Use a watcher to automatically save your state to `localStorage` whenever it changes.
- **`JSON.stringify` / `JSON.parse`**: Since `localStorage` only stores strings, you must convert objects and arrays to a JSON string before saving, and parse them back upon loading.

```vue
<script setup>
import { reactive, watch, onMounted } from 'vue'

const STORAGE_KEY = 'my-app-data'
const state = reactive({ items: [] })

// Load state when the component mounts
onMounted(() => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    state.items = JSON.parse(savedState)
  }
})

// Watch for changes and save to localStorage
watch(state, (newState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.items))
}, { deep: true }) // 'deep' is needed to watch for nested changes in objects/arrays
</script>
```

---

## Module 3: Building with Components

Components are reusable, self-contained blocks of code. They are the building blocks of a Vue application.

---

### 3.1: Creating and Using a Component

A component is just a `.vue` file that can be imported and used in another component.

```vue
<!-- src/components/MyButton.vue -->
<template>
  <button class="my-button">
    Click Me
  </button>
</template>

<style>
.my-button {
  background-color: blue;
  color: white;
  border-radius: 4px;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
// 1. Import the component
import MyButton from './components/MyButton.vue'
</script>

<template>
  <h1>My App</h1>
  <!-- 2. Use it in the template -->
  <MyButton />
</template>
```

---

### 3.2: Passing Data with Props

Props (short for "properties") are how you pass data from a parent component down to a child component.

- **`defineProps`**: A macro used in the child component to declare the props it expects to receive.

```vue
<!-- ChildComponent.vue -->
<script setup>
// Declare that this component accepts a 'message' prop of type String
const props = defineProps({
  message: String
})
</script>

<template>
  <p>{{ props.message }}</p>
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import ChildComponent from './ChildComponent.vue'
</script>

<template>
  <!-- Pass data to the 'message' prop using a v-bind -->
  <ChildComponent :message="'Hello from the parent!'" />
</template>
```

---

### 3.3: Emitting Events

Child components should not directly modify parent state. Instead, they should **emit events** to notify the parent that something happened. The parent then decides how to update its state. This is the "props down, events up" pattern.

- **`defineEmits`**: A macro used in the child to declare the events it can emit.
- **`$emit`**: The function used to trigger an event.

```vue
<!-- ChildComponent.vue -->
<script setup>
// Declare that this component can emit a 'response' event
const emit = defineEmits(['response'])

function sendResponse() {
  // Emit the event with an optional payload
  emit('response', 'Hello from the child!')
}
</script>

<template>
  <button @click="sendResponse">Send Response</button>
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childMsg = ref('')

function handleResponse(msg) {
  childMsg.value = msg
}
</script>

<template>
  <!-- Listen for the 'response' event with @response -->
  <ChildComponent @response="handleResponse" />
  <p>Message from child: {{ childMsg }}</p>
</template>
```

---

### 3.4: Simplifying `v-model` on Components

You can use `v-model` on your own components to create a two-way binding, just like with native inputs. This is useful for creating custom form controls.

- **`defineModel`**: A new (Vue 3.4+) macro that makes this easy. It automatically declares a `modelValue` prop and an `update:modelValue` event.

```vue
<!-- CustomInput.vue -->
<script setup>
// This sets up a v-model binding on the component
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const text = ref('Initial value')
</script>

<template>
  <!-- Now you can use v-model directly on your component -->
  <CustomInput v-model="text" />
  <p>Current value: {{ text }}</p>
</template>
```

---

### 3.5: Animating Lists with `<TransitionGroup>`

Vue provides the `<TransitionGroup>` component to apply smooth animations when items are added, removed, or reordered in a list rendered with `v-for`.

- It renders as a real element (e.g., a `<ul>` or `<div>`).
- You define the animation styles using CSS transition classes.

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>

<style>
/*
  Define enter, leave, and move animations
  for the 'list' transition name.
*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

---

## Module 4: Application Structure & Navigation

This module covers how to structure a multi-page application using Vue Router and share state between different pages.

---

### 4.1: Multi-Page Apps with Vue Router

Vue Router is the official library for adding navigation to your application.

- **`createRouter`**: Creates a router instance where you define your routes.
- **Routes**: A route maps a URL path (e.g., `/about`) to a specific component.
- **`<RouterView>`**: A component that acts as a placeholder, rendering the component for the current URL.
- **`<RouterLink>`**: A component for creating navigation links. It renders as an `<a>` tag but handles navigation without a full page reload.

```js
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView }
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
```

```vue
<!-- src/App.vue -->
<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <!-- The component for the current route will be rendered here -->
  <RouterView />
</template>
```

---

### 4.2: Route Parameters

You can define dynamic segments in your URL, called "params," to pass data to a route. This is common for detail pages (e.g., a specific user's profile).

- **Dynamic Route**: Define a route with a colon (e.g., `/users/:id`).
- **`useRoute`**: A function that gives you access to the current route object, including its params.

```js
// src/router/index.js
// ...
const routes = [
  // ...
  { path: "/users/:id", component: UserProfileView }
];
// ...
```

```vue
<!-- src/views/UserProfileView.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const userId = ref(route.params.id)

onMounted(() => {
  // You can now fetch data for this specific user
  console.log(`Fetching data for user ID: ${userId.value}`)
})
</script>

<template>
  <h1>User Profile</h1>
  <p>Displaying profile for user #{{ userId }}</p>
</template>
```

---

### 4.3: Sharing State Across Routes

When your application grows, you'll often need to share state between different pages (components). The simplest way to do this is to extract your reactive state into its own JavaScript file.

This is a basic form of "state management."

```js
// src/state.js
import { reactive } from "vue";

// Create a reactive object that can be imported anywhere
export const store = reactive({
  user: null,
  cart: []
});

export function login(userData) {
  store.user = userData;
}
```

```vue
<!-- AnyComponent.vue -->
<script setup>
// Import the shared state
import { store } from '../state.js'
</script>

<template>
  <div v-if="store.user">
    Welcome, {{ store.user.name }}
  </div>
</template>
```

---

## Module 5: Interacting with the Web

This module covers fetching data from external APIs and integrating with third-party services.

---

### 5.1: Fetching Data from an API

Most web applications need to fetch data from a server. The browser's `fetch` API is the standard way to do this.

- **`async/await`**: Modern syntax for handling asynchronous operations like API calls, making the code easier to read.
- **Loading State**: It's good practice to track a "loading" state so you can show a spinner or message to the user while the data is being fetched.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const isLoading = ref(false)
const error = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://api.example.com/data')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    data.value = await response.json()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <pre v-else>{{ data }}</pre>
</template>
```

---

### 5.2: Integrating with Third-Party Services (e.g., Firebase)

Services like Firebase provide backend functionality (database, authentication, AI models) that you can easily integrate into your Vue app.

- **Firebase SDK**: You install the Firebase library via `npm` and initialize it with your project's configuration keys.
- **Service Abstraction**: It's a good practice to wrap third-party logic in your own "service" file (e.g., `src/services/firebase.js`). This keeps your components clean and makes it easier to manage the integration.

```js
// src/services/llmService.js (Example)
import { getFunctions, httpsCallable } from "firebase/functions";

// This function calls a Firebase Cloud Function that uses an LLM
export async function processTextWithAI(text) {
  const functions = getFunctions();
  const callAI = httpsCallable(functions, "processText");
  const result = await callAI({ text });
  return result.data;
}
```

```vue
<!-- MyComponent.vue -->
<script setup>
import { ref } from 'vue'
import { processTextWithAI } from '../services/llmService.js'

const inputText = ref('two apples and a carton of milk')
const structuredList = ref(null)

async function generateList() {
  structuredList.value = await processTextWithAI(inputText.value)
}
</script>
```
