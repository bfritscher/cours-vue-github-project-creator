# Travel Log Github Project Creator

A tool to create all the labels, issues and project cards for the Travel Log project.

## Setup

### Repo / Project Setup

1. Create a repo on github
2. Create a template project named `LIA_TEMPLATE`, or set `GITHUB_PROJECT_TEMPLATE_NAME` to a different project name

The template project must have the following setup:

- A board view layout
- A single select field named `Status`
- A `Status` option named `Backlog`

The script validates these requirements after copying the template. If any of them are missing, project creation will succeed but the bootstrap process will stop before adding issues to the board.

### Tool Setup

Create a .env file and update with your values.

If the repository has no linked project, the script will find the template project named by `GITHUB_PROJECT_TEMPLATE_NAME`, copy it, and link the copy to the repository.

You can create a github token with the "repo" and "project" scope [here](https://github.com/settings/tokens/new).

```sh
cp .env.example .env
```

Install dependencies:

```sh
pnpm install
```

## Run

Run the tool to create the labels, issues and project cards.

```sh
pnpm start
```

## Use this tool for other projects

- The stories are in the [./data](./data) folder as markdown files.
  - Epics are in [./data/epics/](./data/epics/)
  - User stories are in [./data/stories/](./data/stories/)
    - Each story file name should start with the corresponding epic story number.
- The priority / order of stories on the board is in [./data/priority.json](./data/priority.json)
- The code in [./src/index.ts](./src/index.ts) reads the markdown files in and creates the labels, issues and project cards accordingly.
