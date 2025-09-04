---
title: Version project with git and GitHub
label: Project Setup
---

As a developer, I want to version my project with Git and push it to GitHub so that my code is saved and I can collaborate with others.

### New Concepts

- **Git Commands:** `init`, `add`, `commit`, `branch`, `remote`, `push`.

### Checklist

- [ ] `cd` into the created project folder.
- [ ] Save the initial state with Git and push to GitHub:
  ```sh
  git init
  git add -A
  git commit -m "initial commit"
  git branch -M main
  git remote add origin https://github.com/heg-web/<<repo-name>>.git
  git push -u origin main
  ```
