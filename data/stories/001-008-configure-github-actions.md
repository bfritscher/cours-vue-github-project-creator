---
title: Configure building on the server with Github Actions
label: Project Setup
---

As a developer, I want to configure GitHub Actions to automatically build and deploy my project to GitHub Pages, so that my changes are always available online.

### New Concepts

- **GitHub Actions:** A CI/CD platform to automate your build, test, and deployment pipeline.
- **Vite `base` config:** Configuration for deploying to a subfolder.

### Checklist

- [ ] Edit `vite.config.js` to handle subfolder deployment. Configure the `mode` parameter and add the `base` config:
  ```js
  export default defineConfig(({ mode }) => ({
    plugins: [vue(), vueDevTools()],
    base: mode === 'production' ? '/<<GITHUB_REPO>>/' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }))
  ```
- [ ] Create a `.github/workflows` directory in your repository.
- [ ] Create a new file in that directory called `deploy.yml` with the following content:

  ```yaml
  name: Build and Deploy to GH-Pages

  on:
    push:
      branches:
        - master
        - main

  permissions:
    contents: write

  jobs:
    build_deploy:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout Code
          uses: actions/checkout@v4

        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: '22'

        - name: Cache dependencies
          uses: actions/cache@v4
          with:
            path: ~/.npm
            key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
            restore-keys: |
              ${{ runner.os }}-node-
        - run: npm ci
        - run: npm run build

        - name: deploy
          uses: peaceiris/actions-gh-pages@v4
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./dist
  ```

- [ ] Commit and push your changes, and check that the GitHub Actions workflow is running correctly.
